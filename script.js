document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById("nav-placeholder");

    if (navPlaceholder) {
        fetch("nav.html")
            .then(response => response.text())
            .then(data => {
                navPlaceholder.innerHTML = data;
                initializeNavLogic();
            })
            .catch(err => console.error("Error loading navigation:", err));
    }
});

function initializeNavLogic() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navItems = document.querySelector(".nav-items");

    if (menuToggle && navItems) {
        menuToggle.addEventListener("click", () => {
            navItems.classList.toggle("active");
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!navItems.contains(e.target) && !menuToggle.contains(e.target)) {
                navItems.classList.remove("active");
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", () => {
                navItems.classList.remove("active");
            });
        });
    }
}