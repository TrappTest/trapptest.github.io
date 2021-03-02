var firebaseConfig = {
  apiKey: "AIzaSyBkLxwBwrFhDKwvKZi6oK8uaLkm3C4cJmM",
  authDomain: "fir-html-ad45a.firebaseapp.com",
  projectId: "fir-html-ad45a",
  storageBucket: "fir-html-ad45a.appspot.com",
  messagingSenderId: "50777910734",
  appId: "1:50777910734:web:bf2963f21d6f4c29fb4f9f",
  measurementId: "G-2XETYYFH9H"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var authenticationHTML = document.getElementById("authentication");
var feedbackHTML = document.getElementById("feedback");
var chatHTML = document.getElementById("screen-chat");
var messagesHTML = document.getElementById("messages");

var db = firebase.firestore();

function signup() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log("create account with " + email + " " + password);

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    console.log("Account created!");
    var user = userCredential.user;
    hideAuth();
    showChatScreen();
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    feedbackHTML.innerHTML = errorMessage;
    console.log(errorMessage);
    // ...
  });
}

function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log("Logged in!");
    hideAuth();
    showChatScreen();
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    feedbackHTML.innerHTML = errorMessage;
    console.log(errorMessage);
  });
}

function showAuth() {
  authenticationHTML.style.display = "block";
  chatHTML.style.display = "none";
}

function hideAuth() {
  authenticationHTML.style.display = "none";
}

function showChatScreen() {
  chatHTML.style.display = "block";
  loadMessages();
  document.body.style.display = "block";
}

function sendMessage() {
  var message = document.getElementById("message-input").value; 

  if (message == "") {
    return;
  }

  var message_dictionary = {
    "message": message,
    "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
    "user": firebase.auth().currentUser.email
  };

  db.collection("channels").doc("wx8zcZjlFbn4sRbO6ZfZ").collection("messages").add(message_dictionary)
  .then((docRef) => {
    document.getElementById("message-input").value = "";
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
}

function createMessageHTML(message, timestamp, user) {
  var messageContainerHTML = document.createElement("div");

  if (message) {
    var messageHTML = document.createElement("p");
    messageHTML.innerHTML = message;
    messageContainerHTML.appendChild(messageHTML);
  }


  if (timestamp) {
    var timestampHTML = document.createElement("p");
    timestampHTML.innerHTML = formatDate(timestamp.toDate());
    messageContainerHTML.appendChild(timestampHTML);
  }

  if (user) {
    var userHTML = document.createElement("p");
    userHTML.innerHTML = user;
    messageContainerHTML.appendChild(userHTML);

    messagesHTML.appendChild(messageContainerHTML);
  }
}

function loadMessages() {
  db.collection("channels").doc("wx8zcZjlFbn4sRbO6ZfZ").collection("messages").orderBy("timestamp", "desc")
  .onSnapshot((querySnapshot) => {
      messagesHTML.innerHTML = "";
      querySnapshot.forEach((doc) => {
        createMessageHTML(doc.data().message, doc.data().timestamp, doc.data().user);
      });
    });
}

document.addEventListener("keypress", function (event) {
  var key = event.keyCode || event.which;
  if (event.keyCode == 13) {
    sendMessage();
  }
});

function formatDate(date) {
  hours = turnIntoTwoDigits(date.getHours());
  minutes = turnIntoTwoDigits(date.getMinutes());
  //seconds = turnIntoTwoDigits(date.getSeconds());
  return hours + ":" + minutes; // + ":" + seconds;
}

function turnIntoTwoDigits(n) {
  return n < 10 ? '0' + n : n;
}

var now = new Date();
console.log(formatDate(now)); // prints hh:mm