/* ===============================
   GESTION DES COMMENTAIRES (serveur PHP + JSON + suppression admin)
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
    let comments = [];
    let visibleCount = 3;
    const API_URL = "comments.php";
  
    // Charger les commentaires depuis le serveur
    async function loadComments() {
      try {
        const res = await fetch(API_URL);
        comments = await res.json();
        renderComments();
      } catch (err) {
        console.error("Erreur de chargement des commentaires :", err);
      }
    }
  
    // Ajouter un commentaire
    async function addComment(username, message) {
      try {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, message }),
        });
        loadComments();
      } catch (err) {
        console.error("Erreur lors de l'envoi :", err);
      }
    }
  
    // Supprimer un commentaire sur le serveur (admin)
    async function deleteComment(index) {
      try {
        const res = await fetch(API_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            index: comments.length - 1 - index, // car ils sont inversés à l'affichage
            user: ADMIN_USER,
            pass: ADMIN_PASS,
          }),
        });
  
        const data = await res.json();
        if (data.success) {
          alert("Message supprimé ✅");
          loadComments();
        } else {
          alert("Erreur : " + (data.error || "inconnue"));
        }
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  
    // Afficher les commentaires (3 par 3)
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
          ${isAdmin ? `<button class="delete-btn" data-index="${index}" title="Supprimer">🗑️</button>` : ""}
        `;
        commentList.appendChild(div);
      });
  
      soutiensCount.textContent = comments.length;
      loadMoreBtn.classList.toggle("hidden", comments.length <= visibleCount);
    }
  
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  
    // Formulaire → ajout
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      const message = messageInput.value.trim();
      if (!username || !message) return;
      addComment(username, message);
      form.reset();
    });
  
    // Voir plus
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += 3;
      renderComments();
    });
  
    // Suppression admin
    commentList.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn");
      if (!btn || !isAdmin) return;
      const index = parseInt(btn.getAttribute("data-index"));
      if (confirm("Supprimer ce message ?")) {
        deleteComment(index);
      }
    });
  
    // Lien secret admin
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
    loadComments();
  });
  