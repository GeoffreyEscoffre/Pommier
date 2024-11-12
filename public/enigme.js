document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('code-input');
  const checkButton = document.getElementById('check-code-button');
  const coffreImage = document.getElementById('coffre-image');
  const successMessage = document.getElementById('success-message'); // Récupère l'élément du message de succès
  const modal = document.getElementById('error-modal');
  const retryButton = document.getElementById('retry-button');

  // Récupère le code correct depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const correctCode = urlParams.get('code');

  checkButton.addEventListener('click', () => {
    const userCode = codeInput.value;

    if (userCode === correctCode) {
      coffreImage.src = 'coffre_ouvert.webp'; // Affiche le coffre ouvert
      successMessage.style.display = 'block'; // Affiche le message de succès
    } else {
      modal.style.display = 'flex'; // Affiche la modale en cas de code incorrect
    }
  });

  // Ferme la modale lorsque le bouton "Réessayer" est cliqué
  retryButton.addEventListener('click', () => {
    modal.style.display = 'none';
    codeInput.value = ''; // Vide le champ de code
    codeInput.focus(); // Remet le focus dans le champ de code
  });
});
