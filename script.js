import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://to-do-44e4-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app); // CONNECTS project with firebase
let itemsInDB = ref(database, "Links"); // create reference in database
// let taskInDB = ref(database, "task"); // create reference in database
// console.log(taskInDB);

console.log(appSettings);
console.log(database);

let input_obj = document.getElementById("input-obj");
let btn_add = document.getElementById("btn-add");
let todo_list = document.getElementById("todo_list");

btn_add.addEventListener("click", function () {
  let input_value = input_obj.value;
  if (input_value == "") {
    alert("Enter Some task !!");
  } else {
    // appendTodoListEle(input_value);
    push(itemsInDB, input_value);
    // alert(`${input_value} added to DB`);
    console.log(`${input_value} added to DB`);
    clearInputObj();
  }
});

onValue(itemsInDB, function (snapshot) {
  if (!snapshot.exists()) {
    // console.log("No item here....")
    todo_list.innerHTML = `<h1 class="heading">You're All Done ✅ </h1>`;
    todo_list.style.display = "block";
  }

  let arrTask = Object.entries(snapshot.val());

  console.log(arrTask);
  //   console.log(snapshot.val());

  clearListEle();
  for (let i = 0; i < arrTask.length; i++) {
    let currentEle = arrTask[i]; // arr of [id,value]
    // let currentTask_id = currentEle[0];
    // let currentTask_value = currentEle[1];

    appendTodoListEle(currentEle);
  }
});

function clearInputObj() {
  input_obj.value = null;
}
function clearListEle() {
  todo_list.innerHTML = "";
}

let icon = ["bi-check2-circle", "bi-check-circle-fill"];
function appendTodoListEle(item) {
  //   todo_list.innerHTML += `<li><i class="bi ${li[1]}" id="${item}"></i> <span>${item}</span> </li>`;

  let currentEle_ID = item[0];
  let currentEle_value = item[1];
  let newEle = document.createElement("li");
  newEle.innerHTML = `<i class="bi ${icon[0]}" id="${currentEle_ID}"></i> <span>${currentEle_value}</span> `;
  todo_list.append(newEle);

  newEle.addEventListener("dblclick", function () {
    newEle.style.backgroundColor = "crimson";
    let exactLocationOfItemInDB = ref(database, `ToDo_items/${currentEle_ID}`);
    remove(exactLocationOfItemInDB);
    // alert(exactLocationOfItemInDB)
  });

  let check = document.getElementById(currentEle_ID);

  check.addEventListener("click", function () {
    this.classList.toggle(`${icon[1]}`);
    this.classList.toggle(`${icon[0]}`);
  });
}
