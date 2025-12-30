const dateElement = document.getElementById("date");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progress");

const today = new Date();

const options = { weekday: "long", day: "numeric", month: "short"};
dateElement.textContent = today.toLocaleDateString("en-US", options);

let tasks = [];
const MAX_TASKS = 10;

function saveTasks() {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
}

function loadTasks(){
    const storedTasks = localStorage.getItem("dailyTasks");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

function updateProgress() {
    const completedCount = tasks.filter(task => task.completed).length;
    progressText.textContent = `${completedCount} / ${MAX_TASKS} completed`;
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();

            if (tasks.length < MAX_TASKS) {
                taskInput.disabled = false;
                addTaskBtn.disabled = false;
            }
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateProgress();
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;
    if (tasks.length >= MAX_TASKS) return;

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();

    taskInput.value = "";
    renderTasks();

    if (tasks.length === MAX_TASKS) {
        taskInput.disabled = true;
        addTaskBtn.disabled = true;
    }
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

loadTasks();
renderTasks();

if (tasks.length >= MAX_TASKS) {
    taskInput.disabled = true;
    addTaskBtn.disabled = true;
}