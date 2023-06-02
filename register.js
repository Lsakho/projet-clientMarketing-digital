// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA3nCtV7mFl8TS0JqjgGuw4VzPFpEG9LG4",
    authDomain: "monprojet-3ff2c.firebaseapp.com",
    projectId: "monprojet-3ff2c",
    storageBucket: "monprojet-3ff2c.appspot.com",
    messagingSenderId: "934227114457",
    appId: "1:934227114457:web:d7433e57e84881dc8ac1c8"
  };
  
  
// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);

// Référence au formulaire d'inscription
const registerForm = document.getElementById("registerForm");

// Gestionnaire d'événement pour la soumission du formulaire d'inscription
registerForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupération des valeurs des champs de saisie
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const confirmPassword = registerForm.confirmPassword.value;

  // Vérification que les mots de passe correspondent
  if (password !== confirmPassword) {
    showError("Les mots de passe ne correspondent pas.");
    return;
  }

  // Création du compte utilisateur avec Firebase
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // L'utilisateur est enregistré avec succès
      // Vous pouvez effectuer ici les opérations souhaitées après l'enregistrement
      console.log("Inscription réussie !");
      
      // Rediriger vers la page de connexion
      window.location.href = "login.html";


    })
    .catch(function(error) {
      // Une erreur s'est produite lors de l'enregistrement
      const errorMessage = error.message;
      showError(errorMessage);
    });
});

// Fonction pour afficher un message d'erreur
function showError(message) {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = message;
}