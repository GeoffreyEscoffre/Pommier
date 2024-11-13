document.addEventListener('DOMContentLoaded', async () => {
  let currentQuestionIndex = 0;
  const questionContainer = document.getElementById('question-container');
  const nextButton = document.getElementById('next-button');
  const prevButton = document.getElementById('prev-button');
  let questions = [];
  let selectedAnswers = Array(questions.length).fill(null);
  let score = 0;

  // Identifier le quiz sélectionné
  const urlParams = new URLSearchParams(window.location.search);
  const quiz = urlParams.get('quiz');
  const apiUrl = quiz === 'quiz2' ? '/api/quiz2' : '/api/quiz1';

  try {
    const response = await fetch(apiUrl);
    questions = await response.json();
    displayQuestion();
  } catch (error) {
    questionContainer.innerText = "Erreur lors du chargement des questions.";
  }

 function displayQuestion() {
  const question = questions[currentQuestionIndex];
  questionContainer.innerHTML = `
    <h2>Question ${currentQuestionIndex + 1}: ${question.question}</h2>
    ${question.choices.map((choice, index) => `
      <button class="choice-button" onclick="selectAnswer(${index})">${index + 1}. ${choice}</button>
    `).join('')}
  `;

  // Affiche ou masque les boutons de navigation
  prevButton.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";
  nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Terminer" : "Suivant";

  // Ajoute le bouton "Retour à l'accueil" sous les boutons de navigation
  const returnHomeButton = document.createElement('a');
  returnHomeButton.href = "index.html";
  returnHomeButton.className = "return-home";
  returnHomeButton.textContent = "Retour à l'accueil";

  // Ajoute le bouton de retour au DOM
  const buttonContainer = document.getElementById('button-container');
  buttonContainer.appendChild(returnHomeButton);

  updateButtonStyles();
}


  // Fonction appelée lorsqu'une réponse est sélectionnée
  window.selectAnswer = function(choiceIndex) {
    selectedAnswers[currentQuestionIndex] = choiceIndex;
    updateButtonStyles();
  };

  function updateButtonStyles() {
    const buttons = document.querySelectorAll('.choice-button');
    buttons.forEach((button, index) => {
      if (selectedAnswers[currentQuestionIndex] === index) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });
  }

  // Fonction pour passer à la question suivante ou terminer le quiz
  nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      showResults(); // Affiche les résultats à la fin du quiz
    }
  });

  // Fonction pour passer à la question précédente
  prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion();
    }
  });

  // Fonction pour afficher les résultats à la fin du quiz
  function showResults() {
    selectedAnswers.forEach((answer, index) => {
        if (questions[index].choices[answer] === questions[index].answer) {
            score++;
        }
    });

    // Crée le code de l'énigme en utilisant les indices de réponses correctes
    const code = questions
        .map((question, index) => {
            return question.choices.indexOf(question.answer) + 1;
        })
        .join('');

    questionContainer.innerHTML = `
      <div class="results-container">
        <h2>Quiz terminé !</h2>
        <p>Votre score : ${score} / ${questions.length}</p>
        <h3>Vos réponses :</h3>
        <ul>
          ${selectedAnswers.map((answer, index) => `
            <li>Question ${index + 1}: Réponse ${answer !== null ? answer + 1 : 'Aucune réponse'}</li>
          `).join('')}
        </ul>
        <div class="result-buttons">
          <a href="enigme.html?code=${code}" class="resolve-enigma">Résoudre l'énigme</a>
          <a href="index.html" class="return-home">Retour à l'accueil</a>
        </div>
      </div>
    `;
    nextButton.style.display = "none";
    prevButton.style.display = "none";
}



  displayQuestion();
});

// Charger les données JSON à partir du fichier 'saisons.json'
async function loadSeasonData() {
  const urlParams = new URLSearchParams(window.location.search);
  const saison = urlParams.get('saison'); // Récupérer la saison (été, automne, hiver, etc.)

  if (!saison) {
    document.getElementById('titre-saison').innerText = "Saison non trouvée";
    return;
  }

  try {
    const response = await fetch('/api/saisons');
    const data = await response.json();
    const saisonData = data[saison];

    // Remplir le titre avec le nom de la saison
    document.getElementById('titre-saison').innerText = saisonData.titre;

    // Créer dynamiquement les boutons pour les descriptions
    const buttonsContainer = document.getElementById('buttons-container');
    buttonsContainer.innerHTML = ''; // Réinitialiser le contenu des boutons
    saisonData.descriptions.forEach((description, index) => {
      const button = document.createElement('button');
      button.innerText = `Description ${index + 1}`;
      button.onclick = () => openModal(index + 1);
      buttonsContainer.appendChild(button);
    });

    // Créer dynamiquement les modales pour les descriptions
    const modalesContainer = document.getElementById('modales-container');
    modalesContainer.innerHTML = ''; // Réinitialiser le contenu des modales
    saisonData.descriptions.forEach((description, index) => {
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.id = `modal-${index + 1}`;
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-btn" onclick="closeModal(${index + 1})">×</span>
          <h2>${saisonData.titre}</h2>
          <p>${description.texte}</p>
          <button onclick="openMoreModal(${index + 1})">Mais encore ?</button>
        </div>
      `;
      modalesContainer.appendChild(modal);

      // Créer la modale plus détaillée pour chaque description
      const moreModal = document.createElement('div');
      moreModal.classList.add('modal');
      moreModal.id = `more-modal-${index + 1}`;
      moreModal.innerHTML = `
        <div class="modal-content">
          <span class="close-btn" onclick="closeModal(${index + 1}, true)">×</span>
          <h2>Mais encore ? (Description ${index + 1})</h2>
          <p id="mais-encore-${index + 1}">${description.maisEncore}</p>
        </div>
      `;
      modalesContainer.appendChild(moreModal);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
}

// Ouvrir la modale correspondante
function openModal(number) {
  document.getElementById(`modal-${number}`).style.display = 'block';
}

// Fermer la modale
function closeModal(number, isMore = false) {
  if (isMore) {
    document.getElementById(`more-modal-${number}`).style.display = 'none';
  } else {
    document.getElementById(`modal-${number}`).style.display = 'none';
  }
}

// Ouvrir la modale plus détaillée
function openMoreModal(number) {
  const saison = new URLSearchParams(window.location.search).get('saison');
  fetch('/api/saisons')
    .then(response => response.json())
    .then(data => {
      // Remplacer le contenu "Mais encore" de la modale plus détaillée
      document.getElementById(`mais-encore-${number}`).innerText = data[saison].descriptions[number - 1].maisEncore;
    });

  closeModal(number);
  document.getElementById(`more-modal-${number}`).style.display = 'block';
}

// Initialiser les données de la saison dès que la page est chargée
loadSeasonData();
