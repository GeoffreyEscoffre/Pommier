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
