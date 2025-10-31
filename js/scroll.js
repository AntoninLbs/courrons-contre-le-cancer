/* ===============================
   FADE-IN AU SCROLL
   =============================== */

   document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(".fade-in");
  
    const appearOnScroll = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // évite de relancer l'animation
          }
        });
      },
      {
        threshold: 0.2, // L’élément doit être visible à 20 % pour s’activer
      }
    );
  
    fadeElements.forEach((el) => {
      appearOnScroll.observe(el);
    });
  });
  