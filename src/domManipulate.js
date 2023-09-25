import TodoList from "./task";


const calendars = document.querySelectorAll(".calendar");
const title = document.querySelector(".currentView");
const addTask = document.querySelector(".addTask");
const taskAdd = document.getElementById("taskAdd");
const done = document.getElementById("doneButton");
const edit = document.getElementById("doneButtonEdit");
const tasks = document.getElementById("tasks");
const err = document.getElementById("error");

// New task elements

//Edit task elements

function domChange() {
  changeCurrent();
  newTask();
  createTask();
  remove();
  // renderTodos();
  // editTodo();
}

let todos = new TodoList()

function changeCurrent() {
  calendars.forEach((calendar) => {
    calendar.addEventListener("click", () => {
      calendars.forEach((c) => {
        c.classList.remove("active");
        calendar.classList.add("active");
        title.innerHTML = calendar.innerText;
      });
    });
  });
}

function newTask() {
  addTask.addEventListener("click", () => {
    addTask.style.display = "none";
    if (taskAdd.style.display == "flex") {
      taskAdd.style.display = "none";
    } else {
      taskAdd.style.display = "flex";
    }
  });
}


function setLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todos.tasks));
}

function getLocalStorage() {
  todos.tasks = JSON.parse(localStorage.getItem("todo"));
}

renderTodos()

function setAndRender(){
  setLocalStorage()
  renderTodos()
}

function createTask() {
  const nTitle = document.getElementById("title");
  const nPriority = document.getElementById("prio");
  const nDue = document.getElementById("due");

  done.addEventListener("click", () => {
    if (nTitle.value == "" || nPriority.value == "" || nDue.value == "") {
      err.innerText = "Fill in the fields.";
      return;
    } else {
      err.innerText = "";
      todos.addTask(nTitle.value, nPriority.value, nDue.value)
      console.log(todos.tasks);
      taskAdd.style.display = "none";
      addTask.style.display = "block";
      setAndRender()
    }
  });
}

function remove(){
  document.body.addEventListener("click", (e) => {
    if (e.target.closest('span[id*="delete"]')) {
      let targetTaskId =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.id;
        todos.deleteTask(targetTaskId)
        setAndRender()
    }
})
}


// function editTodo() {

//   document.body.addEventListener("click", (e) => {
//     if (e.target.closest('span[id*="edit"]')) {
//       let targetId =
//         e.target.parentElement.parentElement.parentElement.parentElement
//           .parentElement.id;
//       let targetTask = todoList.find((x) => x._id == targetId);
      
//       tasks.innerHTML += `
//       <div id="taskEdit" class="task">
//       <div class="left">
//           <input type="checkbox" name="done" id="done">
//           <p id="title"><input type="text" name="editTitle" id="editTitle" placeholder="Play minecraft" value="${targetTask._title}"></p>
//           <p id="priority">
//               <select name="editPrio" id="editPrio">
//                   <option selected disabled value="${targetTask._priority}">${targetTask._priority}</option>
//                   <option value="High">High</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Low">Low</option>
//               </select>
       
//           </p>
//       </div>
//       <button id="doneButtonEdit">Edit</button>
//       <div class="adjust">
//           <div class="date"></div>
//           <div class="right">
//               <span><input type="date" name="editDue" id="editDue" value="${targetTask._due}"></span>
//            </div>
//       </div>
//   </div>`
      
//       document.body.addEventListener("click", (e) => {
//         if (e.target.id === "doneButtonEdit") {
//           let taskEdit = document.getElementById("taskEdit")
//           taskEdit.style.display = "none"
//           const eTitle = document.getElementById("editTitle");
//           const ePriority = document.getElementById("editPrio");
//           const eDue = document.getElementById("editDue");
     
//           targetTask._title = eTitle.value
//           targetTask._priority = ePriority.value 
//           targetTask._due = eDue.value 
//           todoList.splice(
//             todoList.findIndex((a) => a._id === targetTask._id),
//             1
//           );

//           todoList.push(targetTask)
//           renderTodos()
//           setLocalStorage()
      
//           tasks.innerHTML += `
//           <div class="task" id="${targetTask._id}">
//           <div class="left">
//               <input type="checkbox" name="done" id="done">
//               <p id="taskName">${targetTask._title}</p>
//               <p id="priority">${targetTask._priority}</p>
//           </div>
      
//           <div class="adjust">
//               <div class="date"></div>
//               <div class="right">
//                   <span>${targetTask._due}</span>
//                   <span id="favourite"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>star-outline</title><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg></span>
//                   <span id="edit"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></span>
//                   <span id="delete"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></span>
//               </div>
//           </div>
//       </div>   
//        `
//       }
//       });
      
//     }
//   });
// }



function renderTodos() {
  getLocalStorage()
  tasks.innerHTML = "";
  todos.tasks.forEach((todo) => {
    tasks.innerHTML += `     
        <div class="task" id="${todo._id}">
        <div class="left">
            <input type="checkbox" name="done" id="done">
            <p id="taskName">${todo._title}</p>
            <p id="priority">${todo._priority}</p>
        </div>
        <div class="adjust">
            <div class="date"></div>
            <div class="right">
                <span>${todo._due}</span>
                <span id="favourite"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>star-outline</title><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg></span>
                <span id="edit"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></span>
                <span id="delete"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></span>
            </div>
        </div>
    </div>`;
  });
}

export default domChange;
