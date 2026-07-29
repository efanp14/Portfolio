/* ==========================================================================
   gallery.js — project gallery + lightbox.

   A project page describes its gallery once, as data, and this script builds
   both the thumbnail grid and the lightbox from it. Adding a screenshot means
   adding one object to the array — no markup, no index numbers to keep in sync.

   USAGE
   -----
   In the page, after <div class="gallery-grid"></div>:

       <script>
         const galleryItems = [
           {
             title: "Main Menu Interface",
             description: "Homepage screenshot.",
             thumb: "assets/trekz/desktop.png",
             media: { type: "image", src: "assets/trekz/desktop.png" }
           }
         ];
       </script>
       <script src="js/gallery.js"></script>

   ITEM FIELDS
   -----------
   title              tile heading
   description        string, or array of strings for multiple paragraphs
   thumb              thumbnail image path
   thumbAlt           thumbnail alt text (defaults to title)
   badge              "video" | "interactive" — icon overlaid on the thumbnail
   fill               true to stretch the thumbnail across the whole tile
   thumbFallbackText  text to show if the thumbnail fails to load
   media              what the lightbox opens:
                        { type: "image",   src, alt }
                        { type: "video",   src, alt }   local .mp4
                        { type: "youtube", id }
                        { type: "embed",   src }        any iframe (blueprintUE…)

   OPTIONS (optional, declare before this script)
   ----------------------------------------------
       const galleryOptions = { wideModal: true };
   ========================================================================== */

(() => {
  const items = typeof galleryItems !== "undefined" ? galleryItems : [];
  const options = typeof galleryOptions !== "undefined" ? galleryOptions : {};

  const grid = document.querySelector(".gallery-grid");
  if (!grid || !items.length) return;

  let currentIndex = 0;
  let modal;
  let mediaContainer;

  /* ---------------------------------------------------------------- tiles */

  function buildTile(item, index) {
    const tile = document.createElement("div");
    tile.className = "media-item";

    const placeholder = document.createElement("div");
    placeholder.className = "media-placeholder";
    if (item.badge) placeholder.classList.add(item.badge);
    if (item.fill) placeholder.classList.add("fill");

    if (item.thumb) {
      const img = document.createElement("img");
      img.src = item.thumb;
      img.alt = item.thumbAlt || item.title || "";
      if (item.thumbFallbackText) {
        img.addEventListener("error", () => showThumbFallback(placeholder, item));
      }
      placeholder.appendChild(img);
    }

    const content = document.createElement("div");
    content.className = "media-content";

    const heading = document.createElement("h3");
    heading.className = "media-title";
    heading.textContent = item.title || "";
    content.appendChild(heading);

    const paragraphs = Array.isArray(item.description)
      ? item.description
      : [item.description];

    paragraphs.forEach((text, i) => {
      if (!text) return;
      const p = document.createElement("p");
      // Only the first paragraph gets the small caption styling; any extras
      // read as normal body copy.
      if (i === 0) p.className = "media-description";
      p.textContent = text;
      content.appendChild(p);
    });

    tile.append(placeholder, content);
    tile.addEventListener("click", () => openModal(index));
    return tile;
  }

  function showThumbFallback(placeholder, item) {
    placeholder.style.background = "#2a2f3d";
    placeholder.innerHTML = "";
    const label = document.createElement("span");
    label.style.color = "white";
    label.textContent = item.thumbFallbackText;
    placeholder.appendChild(label);
  }

  /* -------------------------------------------------------------- lightbox */

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "modal";

    const content = document.createElement("div");
    content.className = options.wideModal ? "modal-content wide" : "modal-content";

    content.appendChild(makeButton("modal-close", "×", closeModal));
    content.appendChild(makeButton("modal-nav prev", "‹", previousMedia));
    content.appendChild(makeButton("modal-nav next", "›", nextMedia));

    mediaContainer = document.createElement("div");
    mediaContainer.className = "modal-media-container";
    content.appendChild(mediaContainer);

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Clicking the backdrop (but not the frame) closes the lightbox.
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function makeButton(className, label, onClick) {
    const button = document.createElement("button");
    button.className = className;
    button.innerHTML = label;
    button.addEventListener("click", onClick);
    return button;
  }

  function openModal(index) {
    currentIndex = index;
    updateModalContent();
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // prevent background scrolling
  }

  function closeModal() {
    // Stop whatever is playing before hiding the frame.
    const video = mediaContainer.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    const iframe = mediaContainer.querySelector("iframe");
    if (iframe) iframe.src = "";

    modal.classList.remove("active");
    document.body.style.overflow = ""; // restore scrolling
  }

  function nextMedia() {
    currentIndex = (currentIndex + 1) % items.length;
    updateModalContent();
  }

  function previousMedia() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateModalContent();
  }

  function updateModalContent() {
    const media = items[currentIndex].media;
    mediaContainer.innerHTML = "";
    if (!media) return;

    const node = createMediaNode(media);
    if (node) mediaContainer.appendChild(node);
  }

  function createMediaNode(media) {
    switch (media.type) {
      case "image": {
        const img = document.createElement("img");
        img.src = media.src;
        img.alt = media.alt || "";
        img.className = "modal-image";
        return img;
      }
      case "video": {
        const video = document.createElement("video");
        video.src = media.src;
        video.className = "modal-video";
        video.controls = true;
        video.autoplay = false;
        video.preload = "metadata";
        video.onerror = () => {
          console.error("Error loading video:", media.src);
          mediaContainer.innerHTML =
            '<div style="color: white; text-align: center; padding: 2rem;">Error loading video</div>';
        };
        return video;
      }
      case "youtube": {
        const iframe = makeEmbed(
          `https://www.youtube.com/embed/${media.id}?autoplay=1&rel=0`
        );
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        return iframe;
      }
      case "embed": {
        const iframe = makeEmbed(media.src);
        iframe.scrolling = "no";
        return iframe;
      }
      default:
        console.error("Unknown gallery media type:", media.type);
        return null;
    }
  }

  function makeEmbed(src) {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.className = "modal-embed";
    iframe.allowFullscreen = true;
    return iframe;
  }

  /* ------------------------------------------------------------------ init */

  items.forEach((item, index) => grid.appendChild(buildTile(item, index)));
  buildModal();

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") nextMedia();
    if (e.key === "ArrowLeft") previousMedia();
  });
})();
