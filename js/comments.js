/* ===============================
   GESTION DES COMMENTAIRES / AVIS
   - Affichage horizontal (3 visibles)
   - Bouton "Voir plus"
   - Mode admin secret (user: toto / pass: toto)
   =============================== */

   document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("commentForm");
    const usernameInput = document.getElementById("username");
    const messageInput = document.getElementById("message");
    const commentList = document.getElementById("commentList");
    const soutiensCount = document.getElementById("soutiensCount");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const adminTrigger = document.getElementById("adminTrigger");
  
    const ADMIN_USER = "toto";
    const ADMIN_PASS = "toto";
    let isAdmin = sessionStorage.getItem("isAdmin") === "true";
  
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    let visibleCount = 3; // nombre d'avis visibles au départ
  
    // Enregistrer les commentaires
    function saveComments() {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  
    // Affichage des commentaires (3 par 3)
    function renderComments() {
        commentList.innerHTML = "";
      
        comments.slice(0, visibleCount).forEach((c, index) => {
          const div = document.createElement("div");
          div.classList.add("comment");
          if (isAdmin) div.classList.add("admin-visible");
      
          div.innerHTML = `
            <strong>${escapeHtml(c.username)}</strong>
            <p>${escapeHtml(c.message)}</p>
            <small>${new Date(c.date).toLocaleDateString("fr-FR")}</small>
            <button class="delete-btn" data-index="${index}" title="Supprimer">🗑️</button>
          `;
      
          commentList.appendChild(div);
        });
      
        soutiensCount.textContent = comments.length;
      
        if (comments.length > visibleCount) {
          loadMoreBtn.classList.remove("hidden");
        } else {
          loadMoreBtn.classList.add("hidden");
        }
      }
      
  
    // Échapper les caractères HTML
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  
    // Ajouter un commentaire
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const username = usernameInput.value.trim();
      const message = messageInput.value.trim();
      if (!username || !message) return;
  
      const newComment = {
        username,
        message,
        date: new Date().toISOString(),
      };
  
      comments.unshift(newComment); // ajoute en haut
      saveComments();
      form.reset();
      renderComments();
    });
  
    // Bouton "Voir plus"
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += 3;
      renderComments();
    });
  
    // Suppression (admin)
// Suppression (admin)
commentList.addEventListener("click", (e) => {
    // On s'assure que même si on clique sur l'emoji 🗑️, on remonte bien jusqu'au bouton
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;
  
    if (!isAdmin) {
      alert("Accès refusé.");
      return;
    }
  
    const index = parseInt(btn.getAttribute("data-index"), 10);
    if (isNaN(index)) return;
  
    if (confirm("Supprimer ce message ?")) {
      comments.splice(index, 1);
      saveComments();
      renderComments();
    }
  });
  
  
    // Lien secret pour activer le mode admin
    adminTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      const user = prompt("Identifiant admin :");
      if (user === null) return;
      const pass = prompt("Mot de passe admin :");
      if (pass === null) return;
  
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        isAdmin = true;
        sessionStorage.setItem("isAdmin", "true");
        alert("Mode admin activé ✅ (tu peux maintenant supprimer les messages)");
        renderComments();
      } else {
        alert("Identifiants incorrects ❌");
      }
    });
  
    // Initialisation
    renderComments();
  });
  