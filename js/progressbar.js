/* ===============================
   ANIMATION DE LA BARRE DE DONS (corrigée)
   =============================== */

   document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progressBar");
    const progressLabel = document.getElementById("progressLabel");
    let hasAnimated = false;
  
    // ---- CONFIGURATION ----
    const goal = 420;     // Objectif total (€)
    const current = 50;    // Montant actuel (€)
    const progress = (current / goal) * 100; // Pourcentage exact
  
    function animateProgress() {
      if (hasAnimated) return;
      hasAnimated = true;
  
      let displayed = 0;
      const duration = 1500; // Durée réduite à 0,9 s (plus fluide)
      const fps = 15; // nombre d'étapes par seconde
      const totalSteps = (duration / 1000) * fps;
      const increment = progress / totalSteps;
  
      const interval = setInterval(() => {
        displayed += increment;
        if (displayed >= progress) {
          displayed = progress;
          clearInterval(interval);
        }
  
        const euro = Math.round((displayed / 100) * goal); // plus de perte d'arrondi
        const percentage = Math.round(displayed);
  
        // Largeur de la barre
        progressBar.style.width = `${percentage}%`;
  
        // Texte dynamique
        progressLabel.textContent = `${euro} € (${percentage} %)`;
      }, 1000 / fps);
    }
  
    // ---- DÉCLENCHEMENT AU SCROLL ----
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateProgress();
        });
      },
      { threshold: 0.3 }
    );
  
    const objectifSection = document.querySelector(".objectif");
    observer.observe(objectifSection);
  });
  