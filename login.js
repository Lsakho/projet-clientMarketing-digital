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
  
  // Référence au formulaire de connexion
  const loginForm = document.getElementById("loginForm");
  
  // Gestionnaire d'événement pour la soumission du formulaire de connexion
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page
  
    // Récupération des valeurs des champs de saisie
    const email = loginForm.email.value;
    const password = loginForm.password.value;
  
    // Connexion de l'utilisateur avec Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // L'utilisateur est connecté avec succès
        // Vous pouvez effectuer ici les opérations souhaitées après la connexion
        console.log("Connexion réussie !");
        // Rediriger vers la page de connexion

        window.location.href = "app.html";

      })
      .catch(function(error) {
        // Une erreur s'est produite lors de la connexion
        const errorMessage = error.message;
        showError(errorMessage);
      });
  });
  
  // Fonction pour afficher un message d'erreur
  function showError(message) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.textContent = message;
  }
  