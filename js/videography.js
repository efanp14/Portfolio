/* ==========================================================================
   videography.js — builds the showreel from data and drives the player.

   videography.html declares a `videoSections` array; this script renders the
   rows and wires every card up to the YouTube lightbox. Adding a video is one
   new object — no markup to copy.

   SECTION FIELDS
   --------------
   title    row heading (e.g. "// FPV Cinematography")
   videos   array of video objects

   VIDEO FIELDS
   ------------
   id       YouTube video id — used for both the embed and the thumbnail
   title    caption under the thumbnail
   thumb    optional custom thumbnail; defaults to the YouTube still
   thumbAlt optional alt text for a custom thumbnail
   tags     array of strings, or { label, raw: true } to highlight one
   ========================================================================== */

(() => {
  const sections = typeof videoSections !== "undefined" ? videoSections : [];
  const container = document.querySelector(".container");
  if (!container || !sections.length) return;

  const youtubeThumb = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  /* ------------------------------------------------------------- rendering */

  function buildCard(video) {
    const card = document.createElement("div");
    card.className = "video-card";

    const thumbnail = document.createElement("div");
    thumbnail.className = "thumbnail";

    const img = document.createElement("img");
    img.src = video.thumb || youtubeThumb(video.id);
    if (video.thumbAlt) img.alt = video.thumbAlt;

    const playHint = document.createElement("i");
    playHint.className = "fas fa-play play-hint";
    thumbnail.append(img, playHint);

    const details = document.createElement("div");
    details.className = "video-details";

    const heading = document.createElement("h3");
    heading.textContent = video.title;

    const tags = document.createElement("div");
    tags.className = "tag-container";
    (video.tags || []).forEach((tag) => {
      const span = document.createElement("span");
      const isRaw = typeof tag === "object" && tag.raw;
      span.className = isRaw ? "tag raw" : "tag";
      span.textContent = typeof tag === "object" ? tag.label : tag;
      tags.appendChild(span);
    });

    details.append(heading, tags);
    card.append(thumbnail, details);
    card.addEventListener("click", () => openModal(video.id));
    return card;
  }

  function buildSection(section) {
    const wrapper = document.createElement("section");
    wrapper.className = "row-section";

    const heading = document.createElement("h2");
    heading.className = "row-title";
    heading.textContent = section.title;

    const grid = document.createElement("div");
    grid.className = "video-grid";
    section.videos.forEach((video) => grid.appendChild(buildCard(video)));

    wrapper.append(heading, grid);
    return wrapper;
  }

  sections.forEach((section) => container.appendChild(buildSection(section)));

  /* -------------------------------------------------------------- lightbox */

  const modal = document.getElementById("videoModal");
  const player = document.getElementById("modalPlayer");

  function openModal(id) {
    player.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    player.src = ""; // stops playback
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".modal-content")
    .addEventListener("click", (e) => e.stopPropagation());
  modal.querySelector(".close-btn").addEventListener("click", closeModal);
})();
