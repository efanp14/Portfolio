/* ==========================================================================
   home.js — behaviour for index.html.

   Renders the project list from the `projects` array declared in the page,
   and runs the hero portrait carousel.
   ========================================================================== */

(() => {
  /* ------------------------------------------------------- project cards */

  const grid = document.querySelector(".project-grid");
  const projectList = typeof projects !== "undefined" ? projects : [];

  function buildCard(project) {
    const card = document.createElement("a");
    card.className = "project-card scroll-reveal";
    card.href = project.href;

    const imageBox = document.createElement("div");
    imageBox.className = "project-image-container";
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.imageAlt || project.title;
    img.className = "project-image";
    imageBox.appendChild(img);

    const content = document.createElement("div");
    content.className = "project-content";

    const heading = document.createElement("h3");
    heading.textContent = project.title;

    const blurb = document.createElement("p");
    blurb.textContent = `// ${project.blurb}`;

    const tags = document.createElement("div");
    tags.className = "tech-tags";
    (project.tags || []).forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = `> ${tag}`;
      tags.appendChild(span);
    });

    content.append(heading, blurb, tags);
    card.append(imageBox, content);
    return card;
  }

  if (grid) {
    projectList.forEach((project) => grid.appendChild(buildCard(project)));
  }

  /* ----------------------------------------------------- hero carousel */

  const carouselImage = document.getElementById("carousel-image");
  const hoverZone = document.querySelector(".hover-zone");
  const images = typeof heroImages !== "undefined" ? heroImages : [];

  if (carouselImage && hoverZone && images.length > 1) {
    let currentIndex = 0;
    let delayActive = false;

    hoverZone.addEventListener("mouseenter", () => {
      if (delayActive) return;
      delayActive = true;

      // Hop, then swap to the next portrait mid-bounce.
      carouselImage.classList.add("jump");
      carouselImage.addEventListener(
        "animationend",
        () => carouselImage.classList.remove("jump"),
        { once: true }
      );

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % images.length;
        carouselImage.src = images[currentIndex];
      }, 300);

      setTimeout(() => {
        delayActive = false;
      }, 1000);
    });
  }

  /* ------------------------------------------------------- scroll reveal */

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    },
    { threshold: 0.1 }
  );
  document
    .querySelectorAll(".scroll-reveal")
    .forEach((element) => observer.observe(element));
})();
