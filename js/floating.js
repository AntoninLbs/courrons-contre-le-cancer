/* ===============================
   GESTION DU BOUTON FLOTTANT ❤️
   =============================== */

   document.addEventListener("DOMContentLoaded", () => {
    const floatingBtn = document.querySelector(".floating-btn");
    const ctaSection = document.querySelector("#don");
  
    if (!floatingBtn || !ctaSection) return;
  
    function toggleFloatingButton() {
      const ctaRect = ctaSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
      // Si la section "don" est visible à l’écran, on cache le bouton flottant
      if (ctaRect.top <= windowHeight && ctaRect.bottom >= 0) {
        floatingBtn.style.opacity = "0";
        floatingBtn.style.pointerEvents = "none";
        floatingBtn.style.transform = "scale(0.8)";
      } else {
        floatingBtn.style.opacity = "1";
        floatingBtn.style.pointerEvents = "auto";
        floatingBtn.style.transform = "scale(1)";
      }
    }
  
    // Écoute du scroll et du resize
    window.addEventListener("scroll", toggleFloatingButton);
    window.addEventListener("resize", toggleFloatingButton);
  
    // Initialisation
    toggleFloatingButton();
  });
  