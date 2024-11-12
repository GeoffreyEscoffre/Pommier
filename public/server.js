const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir le fichier saisons.json depuis le dossier data
app.get('/api/saisons', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'saisons.json'), 'utf8', (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier saisons.json :", err);
      res.status(500).send("Erreur interne du serveur");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Route pour récupérer les questions du Quiz 1
app.get('/api/quiz1', (req, res) => {
  fs.readFile('./data/quiz1.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impossible de lire le fichier du Quiz 1' });
    }
    res.json(JSON.parse(data));
  });
});

// Route pour récupérer les questions du Quiz 2
app.get('/api/quiz2', (req, res) => {
  fs.readFile('./data/quiz2.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impossible de lire le fichier du Quiz 2' });
    }
    res.json(JSON.parse(data));
  });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
