/* ==========================================================================
   nav.js — injects the shared navigation bar into every page.

   Each page just needs:
       <div class="nav-container" id="nav-placeholder"></div>
       <script src="js/nav.js"></script>

   The markup itself lives in partials/nav.html, so adding or renaming a link
   is a one-line edit in one file.
   ========================================================================== */

const NAV_PARTIAL = "partials/nav.html";

document.addEventListener("DOMContentLoaded", () => {
  const navPlaceholder = document.getElementById("nav-placeholder");
  if (!navPlaceholder) return;

  fetch(NAV_PARTIAL)
    .then((response) => response.text())
    .then((html) => {
      navPlaceholder.innerHTML = html;
      initializeNavLogic();
    })
    .catch((err) => console.error("Error loading navigation:", err));
});

function initializeNavLogic() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navItems = document.querySelector(".nav-items");
  if (!menuToggle || !navItems) return;

  menuToggle.addEventListener("click", () => {
    navItems.classList.toggle("active");
  });

  // Close the mobile menu when clicking outside of it.
  document.addEventListener("click", (e) => {
    if (!navItems.contains(e.target) && !menuToggle.contains(e.target)) {
      navItems.classList.remove("active");
    }
  });

  // Close the mobile menu after following a link.
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navItems.classList.remove("active");
    });
  });
}
