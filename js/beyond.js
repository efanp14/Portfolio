/* ==========================================================================
   beyond.js — builds the file-explorer page from data.

   beyond.html declares a `beyondSections` array; this script renders both the
   sidebar and the panels, and handles switching between them. Adding an
   interest (or a card inside one) is a single entry.

   SECTION FIELDS
   --------------
   id       unique slug, used to tie the sidebar entry to its panel
   label    sidebar filename, e.g. "3D_PRINTING.log"
   icon     Font Awesome classes for the sidebar icon
   title    panel heading
   intro    paragraph under the heading
   cards    array of cards

   CARD FIELDS — either a photo…
   -----------------------------
   image     image path
   fallback  image shown if `image` is missing
   ─ …or an icon:
   icon      Font Awesome classes, e.g. "fas fa-users-cog fa-4x"
   ─ both kinds take:
   title     bold caption
   caption   smaller line underneath
   ========================================================================== */

(() => {
  const sections = typeof beyondSections !== "undefined" ? beyondSections : [];
  const sidebar = document.querySelector(".sidebar");
  const viewer = document.querySelector(".viewer");
  if (!sidebar || !viewer || !sections.length) return;

  /* ------------------------------------------------------------- rendering */

  function buildCard(card) {
    const element = document.createElement("div");
    element.className = "gallery-card";

    if (card.image) {
      const img = document.createElement("img");
      img.src = card.image;
      if (card.fallback) {
        img.addEventListener("error", () => {
          img.src = card.fallback;
        }, { once: true });
      }
      element.appendChild(img);
    } else if (card.icon) {
      const box = document.createElement("div");
      box.className = "card-icon";
      const icon = document.createElement("i");
      icon.className = card.icon;
      box.appendChild(icon);
      element.appendChild(box);
    }

    const info = document.createElement("div");
    info.className = "card-info";

    const title = document.createElement("strong");
    title.textContent = card.title;

    const caption = document.createElement("span");
    caption.textContent = card.caption;

    info.append(title, caption);
    element.appendChild(info);
    return element;
  }

  function buildPanel(section) {
    const panel = document.createElement("section");
    panel.id = section.id;
    panel.className = "content-section";

    const heading = document.createElement("h2");
    heading.textContent = section.title;

    const intro = document.createElement("p");
    intro.textContent = section.intro;

    const grid = document.createElement("div");
    grid.className = "gallery-grid";
    (section.cards || []).forEach((card) => grid.appendChild(buildCard(card)));

    panel.append(heading, intro, grid);
    return panel;
  }

  function buildSidebarItem(section) {
    const item = document.createElement("div");
    item.className = "file-item";
    item.dataset.target = section.id;

    const icon = document.createElement("i");
    icon.className = section.icon;

    item.append(icon, document.createTextNode(` ${section.label}`));
    item.addEventListener("click", () => showSection(section.id));
    return item;
  }

  /* --------------------------------------------------------------- switching */

  function showSection(id) {
    viewer.querySelectorAll(".content-section").forEach((panel) => {
      panel.classList.toggle("active", panel.id === id);
    });
    sidebar.querySelectorAll(".file-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.target === id);
    });
  }

  sections.forEach((section) => {
    sidebar.appendChild(buildSidebarItem(section));
    viewer.appendChild(buildPanel(section));
  });

  // The first entry is open by default.
  showSection(sections[0].id);
})();
