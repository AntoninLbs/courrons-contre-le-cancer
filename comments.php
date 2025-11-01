<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$file = 'comments.json';

// Crée le fichier s’il n’existe pas
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

// Lecture du fichier
$comments = json_decode(file_get_contents($file), true);
if (!is_array($comments)) $comments = [];

// === 1. GET : renvoie tous les commentaires ===
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(array_reverse($comments)); // du plus récent au plus ancien
    exit;
}

// === 2. POST : ajoute un commentaire ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['username']) || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Champs manquants']);
        exit;
    }

    $newComment = [
        'username' => htmlspecialchars(trim($input['username'])),
        'message'  => htmlspecialchars(trim($input['message'])),
        'date'     => date('Y-m-d H:i:s')
    ];

    $comments[] = $newComment;
    file_put_contents($file, json_encode($comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true]);
    exit;
}

// === 3. DELETE : supprime un commentaire (admin) ===
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);

    // Vérifie mot de passe admin
    if (($input['user'] ?? '') !== 'toto' || ($input['pass'] ?? '') !== 'toto') {
        http_response_code(403);
        echo json_encode(['error' => 'Accès refusé']);
        exit;
    }

    // Supprime l’index reçu
    if (!isset($input['index'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Index manquant']);
        exit;
    }

    $index = intval($input['index']);
    if (isset($comments[$index])) {
        array_splice($comments, $index, 1);
        file_put_contents($file, json_encode($comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Commentaire introuvable']);
    }
    exit;
}

// Si autre méthode
http_response_code(405);
echo json_encode(['error' => 'Méthode non autorisée']);
