const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Variables pour stocker les données JSON en mémoire
let saisonsData;
let quiz1Data;
let quiz2Data;

// Charger les fichiers JSON au démarrage de l'application
try {
  saisonsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'saisons.json'), 'utf8'));
  quiz1Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'quiz1.json'), 'utf8'));
  quiz2Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'quiz2.json'), 'utf8'));
} catch (err) {
  console.error("Erreur lors du chargement des fichiers JSON :", err);
}

// Route pour servir les données des saisons
app.get('/api/saisons', (req, res) => {
  if (saisonsData) {
    res.json(saisonsData);
  } else {
    res.status(500).send("Erreur interne du serveur");
  }
});

// Route pour récupérer les questions du Quiz 1
app.get('/api/quiz1', (req, res) => {
  if (quiz1Data) {
    res.json(quiz1Data);
  } else {
    res.status(500).json({ error: 'Impossible de récupérer les questions du Quiz 1' });
  }
});

// Route pour récupérer les questions du Quiz 2
app.get('/api/quiz2', (req, res) => {
  if (quiz2Data) {
    res.json(quiz2Data);
  } else {
    res.status(500).json({ error: 'Impossible de récupérer les questions du Quiz 2' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
