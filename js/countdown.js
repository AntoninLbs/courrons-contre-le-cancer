/* ===============================
   COMPTE À REBOURS J-XX (Europe/Paris + animation)
   =============================== */

   document.addEventListener("DOMContentLoaded", () => {
    const daysSpan = document.getElementById("days");
    const countdown = document.getElementById("countdown");
  
    // Date du marathon : 12 avril 2026 à 08h00 heure de Paris
    const marathonDate = new Date("2026-04-12T08:00:00+02:00");
  
    function updateCountdown(animated = true) {
      const now = new Date();
      const parisTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Paris" })
      );
      const diffTime = marathonDate - parisTime;
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
      const finalValue = daysRemaining > 0 ? daysRemaining : 0;
  
      if (animated) {
        daysSpan.style.transform = "scale(1.3)";
        daysSpan.style.opacity = "0.5";
        setTimeout(() => {
          daysSpan.textContent = finalValue;
          daysSpan.style.transform = "scale(1)";
          daysSpan.style.opacity = "1";
        }, 150);
      } else {
        daysSpan.textContent = finalValue;
      }
    }
  
    // Apparition du bloc
    countdown.style.opacity = "1";
  
    // Initialisation
    updateCountdown(false);
  
    // Mise à jour automatique chaque jour à minuit heure de Paris
    const now = new Date();
    const parisNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
    const millisTillMidnight =
      new Date(parisNow.getFullYear(), parisNow.getMonth(), parisNow.getDate() + 1, 0, 0, 0) - parisNow;
  
    setTimeout(() => {
      updateCountdown(true);
      setInterval(() => updateCountdown(true), 24 * 60 * 60 * 1000);
    }, millisTillMidnight);
  });
  