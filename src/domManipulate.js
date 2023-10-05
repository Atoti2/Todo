import TodoList from "./task";
import ProjectList from "./projects";
import { toDate, isToday, isThisWeek, subDays, compareAsc, format, parseISO } from 'date-fns'


const title = document.querySelector(".currentView");
const addTask = document.querySelector(".addTask");
const taskAdd = document.getElementById("taskAdd");
const done = document.getElementById("doneButton");
const h1 = document.querySelector("h1");
const projectLi = document.querySelector("#projects");
let empty = document.querySelector(".empty");
const tasks = document.getElementById("tasks");
const err = document.getElementById("error");
const delProject = document.getElementById("delProject");

let todayList = []
let weekList = []

function domChange() {
  changeCurrent();
  newTask();
  createTask();
  remove();
  edit();
  toggleDone();
  addProject();
  getToday();
  getWeek()
}

let todos = new TodoList();
let projects = new ProjectList();

if(!localStorage.todo){
  setLocalStorage()
}
if(!localStorage.project){
  setLocalStorageProject()
}
getLocalStorage();
renderTodos(todos.tasks);
renderProjects();

const calendars = document.querySelectorAll(".calendar");
function changeCurrent() {
  calendars.forEach((calendar) => {
    calendar.addEventListener("click", () => {
      calendars.forEach((c) => {
        c.classList.remove("active");
        calendar.classList.add("active");
        title.innerHTML = calendar.innerText;
        switch (h1.textContent) {
          case "All tasks":
            getLocalStorage();
            renderTodos(todos.tasks);
            break;
          case "Today":
            renderTodos(todayList);
            break;
          case "Week":
            renderTodos(weekList);
            break;  
          case "Important":
        }
        if (
          h1.innerText === "All tasks" ||
          h1.innerText === "Today" ||
          h1.innerText === "Week" ||
          h1.innerText === "Important"
        ) {
          addTask.style.display = "none";
        } else {
          addTask.style.display = "flex";
        }
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
setLocalStorage()

function getLocalStorage() {
  todos.tasks = JSON.parse(localStorage.getItem("todo"));
}

function setLocalStorageProject() {
  localStorage.setItem("project", JSON.stringify(projects.projects));
}

function getLocalStorageProject() {
  projects.projects = JSON.parse(localStorage.getItem("project"));
}



let filteredTodos;
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
      todos.addTask(
        nTitle.value,
        nPriority.value,
        nDue.value,
        false,
        h1.textContent
      );
      taskAdd.style.display = "none";
      addTask.style.display = "block";
      empty.classList.add("visible");
      setLocalStorage();
      setFilter();
      renderTodos(filteredTodos);
    }
  });
}

function setFilter() {
  todos.tasks.forEach(() => {
    filteredTodos = todos.tasks.filter((t) => t._project === h1.textContent);
  });
}


projectLi.addEventListener("click", () => {
  getLocalStorage();
  todos.tasks.forEach(() => {
    filteredTodos = todos.tasks.filter((t) => t._project === h1.textContent);
    if (filteredTodos == "") {
      empty.classList.remove("visible");
    }
    if (filteredTodos != "") {
      empty.classList.add("visible");
    }
    renderTodos(filteredTodos);
  });
});

delProject.addEventListener('click', (e) => {
    let t = e.target.parentElement.parentElement.firstElementChild.textContent
    projects.projects.forEach((p) => {
      if(p._title == t){
        let targetId = p._id
        projects.deleteProject(targetId)
        setLocalStorageProject()
        renderProjects()
        console.log(projects);
      }
    })
})

function remove() {
  document.body.addEventListener("click", (e) => {
    if (e.target.closest('span[id*="delete"]')) {
      let targetTaskId =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.id;
      todos.deleteTask(targetTaskId);
      setLocalStorage();
      if (
        h1.innerText === "All tasks" ||
        h1.innerText === "Today" ||
        h1.innerText === "Week" ||
        h1.innerText === "Important"
      ) {
        renderTodos(todos.tasks);
      } else {
        setFilter();
        if (filteredTodos == "") {
          empty.classList.remove("visible");
        }
       
        renderTodos(filteredTodos);
      }
    }
  });
}



function toggleDone() {
  document.body.addEventListener("click", (e) => {
    if (e.target.id === "done") {
      let targetId = e.target.parentElement.parentElement.id;
      todos.toggleTaskCompletion(targetId);
      setLocalStorage();
      if (
        h1.innerText === "All tasks" ||
        h1.innerText === "Today" ||
        h1.innerText === "Week" ||
        h1.innerText === "Important"
      ) {
        renderTodos(todos.tasks);
      } else {
        setFilter();
        renderTodos(filteredTodos);
      }
    }
  });
}

function edit() {
  let targetId = "";
  let count = 0
  document.body.addEventListener("click", (e) => {
    if (e.target.closest('span[id*="edit"]')) {
      targetId =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.id;
      const targetTask = todos.tasks.find((task) => task._id === targetId);
      count ++
      if(count == 1){
        tasks.innerHTML += `
        <div id="taskEdit" class="task">
        <div class="left">
            <p id="title"><input type="text" name="editTitle" id="editTitle" placeholder="Play minecraft" value="${targetTask._title}"></p>
            <p id="priority">
                <select name="editPrio" id="editPrio">
                    <option selected disabled value="${targetTask._priority}">${targetTask._priority}</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
         
            </p>
        </div>
        <button id="doneButtonEdit">Edit</button>
        <div class="adjust">
            <div class="date"></div>
            <div class="right">
                <span><input type="date" name="editDue" id="editDue" value="${targetTask._due}"></span>
             </div>
        </div>
    </div>`;
      }
     
    }
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.id === "doneButtonEdit") {
      const eTitle = document.getElementById("editTitle");
      const ePriority = document.getElementById("editPrio");
      const eDue = document.getElementById("editDue");
      todos.editTask(targetId, eTitle.value, ePriority.value, eDue.value);
      setLocalStorage();
      if (
        h1.innerText === "All tasks" ||
        h1.innerText === "Today" ||
        h1.innerText === "Week" ||
        h1.innerText === "Important"
      ) {
        renderTodos(todos.tasks);
      } else {
        setFilter();
        renderTodos(filteredTodos);
      }
    }
  });
}

const newP = document.querySelector(".newProject");
const projectAdd = document.querySelector(".projectAdd");
add.addEventListener("click", () => {
  newP.classList.toggle("visible");
  projectAdd.classList.toggle("visible");
});

function getToday(){
  todos.tasks.forEach((todo) => {
    let today = format(new Date(), 'yyyy-MM-dd')
    if(today == todo._due){
      todayList.push(todo)
     
    }
  })
}

function getWeek(){
  todos.tasks.forEach((todo) => {
    let week = isThisWeek(parseISO(todo._due))
    if(week){
      weekList.push(todo)
    }
   
  })
}

function addProject() {
  projectAdd.addEventListener("click", () => {
    projects.addProject(newP.value);
    newP.classList.toggle("visible");
    projectAdd.classList.toggle("visible");
    setLocalStorageProject();
    renderProjects();
  });
}

function renderProjects() {
  getLocalStorageProject();
  projectLi.innerHTML = "";
  projects.projects.forEach((project) => {
    projectLi.innerHTML += `
    <li class="calendar"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>menu</title><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>${project._title}</li>`;
  });
}


function renderTodos(list) {

  getLocalStorage();
  tasks.innerHTML = "";
  list.forEach((todo) => {
    tasks.innerHTML += `     
        <div class="task" id="${todo._id}">
        <div class="left">
            <button class="${
              todo._completed ? "notDone" : "done"
            }" type="button" name="done" id="done">Done</button>
            <p id="taskName" class="${todo._completed ? "checked" : ""}">${
      todo._title
    }</p>
            <p id="priority" class="${todo._completed ? "checked" : ""}">${
      todo._priority
    }</p>
        </div>
        <div class="adjust">
            <div class="date"></div>
            <div class="right">
                <span class="${todo._completed ? "checked" : ""}">${
      todo._due
    }</span>
                <span id="edit"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></span>
                <span id="delete"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></span>
            </div>
        </div>
    </div>`;
  });
}

export default domChange;
