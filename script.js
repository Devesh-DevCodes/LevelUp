// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc,  onSnapshot, deleteDoc,query,where , orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBIL24eNCtT0ZiRacx8BJ7Ha6b05LpQYqc",
    authDomain: "devcodes-todo-app.firebaseapp.com",
    projectId: "devcodes-todo-app",
    storageBucket: "devcodes-todo-app.appspot.com",
    messagingSenderId: "754958160845",
    appId: "1:754958160845:web:b87bdc299e85650653ea84",
    measurementId: "G-Y2F0EFZVXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Firebase Authentication
const provider = new GoogleAuthProvider();

// DOM Elements
let input_obj = document.getElementById("input-obj");
let btn_add = document.getElementById("btn-add");
let todo_list = document.getElementById("todo_list");
let login_btn = document.getElementById("login-btn");
let logout_btn = document.getElementById("logout-btn");


// Login with Google
login_btn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("User logged in: ", result.user);
        login_btn.style.display = "none";
        logout_btn.style.display = "block";
        loadTasks();
    } catch (error) {
        console.error("Error during login: ", error);
    }
});

// Logout
logout_btn.addEventListener("click", async () => {
    await signOut(auth);
    login_btn.style.display = "block";
    logout_btn.style.display = "none";
    todo_list.innerHTML = ""; // Clear the task list
});


// Add Task
btn_add.addEventListener("click", async () => {
  let input_value = input_obj.value;
  if (input_value === "") {
      alert("Enter a task!");
  } else {
      try {
          const user = auth.currentUser; // Get the currently logged-in user
          if (user) {
              // Combine username and UID for the document ID
              const sanitizedDisplayName = user.displayName.replace(/\W+/g, ""); // Removes non-word characters
              const combinedID = `${sanitizedDisplayName}-${user.uid}`;

              // Add a new task under this combined ID
              await addDoc(collection(db, "users", combinedID, "tasks"), {
                  task: input_value,
                  createdAt: new Date() // Add a timestamp
              });

              console.log(`${input_value} added to Firestore with ID ${combinedID}`);
              input_obj.value = ""; // Clear input
          }
      } catch (error) {
          console.error("Error adding task: ", error);
      }
  }
});


// Load Tasks from Firestore
function loadTasks() {
  const user = auth.currentUser; // Get the currently logged-in user
  
  if (user) {
    const sanitizedDisplayName = user.displayName.replace(/\W+/g, ""); // Removes non-word characters
    const combinedID = `${sanitizedDisplayName}-${user.uid}`;

      const tasksCollection = collection(db, "users", combinedID , "tasks");

      // Create a query to order tasks by createdAt
      const q = query(tasksCollection, orderBy("createdAt", "desc"));

      onSnapshot(q, (snapshot) => {
          todo_list.innerHTML = ""; // Clear existing tasks
          snapshot.forEach((doc) => {
              let task = doc.data().task;
              let listItem = document.createElement("li");
              listItem.innerHTML = `<i class="bi bi-check2-circle"></i> <span>${task}</span>`;

              listItem.addEventListener("dblclick", async () => {
                  await deleteDoc(doc.ref); // Delete task on double click
              });
              todo_list.appendChild(listItem);
          });
      });
  }
}


// Listen for Auth State Changes
auth.onAuthStateChanged((user) => {
  const userNameElement = document.getElementById("user-name");
  const profilePicElement = document.getElementById("profile-pic");
  const userInfoElement = document.getElementById("user-info");

  if (user) {
      // User is logged in
      console.log("User is logged in:", user);
      login_btn.style.display = "none";
      logout_btn.style.display = "block";
      
      // Display user name and profile picture
      userNameElement.textContent = user.displayName || "User"; // Fallback if displayName is null
      profilePicElement.src = user.photoURL || "assets/td-3.jpg"; // Fallback for profile picture
      userInfoElement.style.display = "flex"; // Show the user info section

      loadTasks(); // Load tasks when the user is logged in
  } else {
      // No user is logged in
      console.log("No user is logged in.");
      login_btn.style.display = "block";
      logout_btn.style.display = "none";
      userInfoElement.style.display = "none"; // Hide the user info section
      todo_list.innerHTML = ""; // Clear the task list when logged out
  }
});


/**
 
Add Task
btn_add.addEventListener("click", async () => {
  let input_value = input_obj.value;
  if (input_value === "") {
      alert("Enter a task!");
  } else {
      const user = auth.currentUser; // Get the currently logged-in user
      if (user) {
          try {
              // Add task to the user's tasks subcollection
              await addDoc(collection(db, "users", user.uid, "tasks"), {
                  task: input_value,
                  createdAt: new Date() // Add a timestamp
              });
              console.log(`${input_value} added to Firestore`);
              input_obj.value = ""; // Clear input
          } catch (error) {
              console.error("Error adding task: ", error);
          }
      }
  }
});

 */