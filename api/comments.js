import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "comments.json");

  // Si le fichier n’existe pas, on le crée
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf8");

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Récupérer les messages
  if (req.method === "GET") {
    return res.status(200).json([...data].reverse());
  }

  // Ajouter un message
  if (req.method === "POST") {
    try {
      const { username, message } = JSON.parse(req.body);
      if (!username || !message) {
        return res.status(400).json({ error: "Champs manquants" });
      }

      const newComment = {
        username,
        message,
        date: new Date().toISOString(),
      };

      data.push(newComment);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

      return res.status(201).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Supprimer un message (admin)
  if (req.method === "DELETE") {
    const { index, user, pass } = JSON.parse(req.body);
    if (user !== "toto" || pass !== "toto") {
      return res.status(403).json({ error: "Accès refusé" });
    }

    if (index >= 0 && index < data.length) {
      data.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      return res.status(200).json({ success: true });
    }
    return res.status(404).json({ error: "Index introuvable" });
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
