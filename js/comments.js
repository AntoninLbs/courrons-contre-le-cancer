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
  
    async function loadComments() {
      try {
        const res = await fetch("/api/comments");
        comments = await res.json();
        renderComments();
      } catch (e) {
        console.error("Erreur de chargement :", e);
      }
    }
  
    async function addComment(username, message) {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, message }),
      });
      loadComments();
    }
  
    async function deleteComment(index) {
      await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, user: ADMIN_USER, pass: ADMIN_PASS }),
      });
      loadComments();
    }
  
    function renderComments() {
      commentList.innerHTML = "";
      comments.slice(0, visibleCount).forEach((c, i) => {
        const div = document.createElement("div");
        div.classList.add("comment");
        if (isAdmin) div.classList.add("admin-visible");
  
        div.innerHTML = `
          <strong>${c.username}</strong>
          <p>${c.message}</p>
          <small>${new Date(c.date).toLocaleDateString("fr-FR")}</small>
          ${isAdmin ? `<button class="delete-btn" data-index="${i}">🗑️</button>` : ""}
        `;
        commentList.appendChild(div);
      });
      soutiensCount.textContent = comments.length;
      loadMoreBtn.classList.toggle("hidden", comments.length <= visibleCount);
    }
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      addComment(usernameInput.value.trim(), messageInput.value.trim());
      form.reset();
    });
  
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += 3;
      renderComments();
    });
  
    commentList.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn");
      if (!btn || !isAdmin) return;
      deleteComment(parseInt(btn.dataset.index));
    });
  
    adminTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      const user = prompt("Identifiant admin :");
      const pass = prompt("Mot de passe admin :");
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        isAdmin = true;
        sessionStorage.setItem("isAdmin", "true");
        alert("Mode admin activé ✅");
        renderComments();
      }
    });
  
    loadComments();
  });
  