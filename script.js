const dateElement = document.getElementById("date");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progress");

let editingIndex = null;

const today = new Date();

const options = { weekday: "long", day: "numeric", month: "short" };
dateElement.textContent = today.toLocaleDateString("en-US", options);

let tasks = [];
const MAX_TASKS = 10;



function saveTasks() {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
}

function loadTasks() {
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

        let contentElement;

        if (editingIndex === index) {
            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = task.text;
            editInput.className = "edit-input";

            editInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    saveEdit(task.id, editInput.value);
                }
                if (e.key === "Escape") {
                    cancelEdit();
                }
            });
            
            li.appendChild(editInput);
            contentElement = editInput;
        } else {
            const span = document.createElement("span");
            span.classList.add("task-text");
            span.textContent = task.text;
            li.appendChild(span);
            contentElement = span;
        }


        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");

        if (editingIndex === index) {
            editBtn.textContent = "Save";
            

            editBtn.addEventListener("click", () => {
                const newText = contentElement.value.trim();

                if (newText === "") return;

                tasks[index].text = newText;
                editingIndex = null;
                saveTasks();
                renderTasks();
            });
        } else {
            editBtn.textContent = "Edit";

            editBtn.addEventListener("click", () => {
                editingIndex = index;
                renderTasks();
            });
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");


        if (task.confirmDelete) {
            deleteBtn.textContent = "Confirm";
        } else {
            deleteBtn.textContent = "Delete";
        }


        deleteBtn.addEventListener("click", () => {
            if (!task.confirmDelete) {
                task.confirmDelete = true;
                renderTasks();
                saveTasks();
                return;
            }

            tasks.splice(index, 1);
            saveTasks();
            renderTasks();

            if (tasks.length < MAX_TASKS) {
                taskInput.disabled = false;
                addTaskBtn.disabled = false;
            }
        });

        li.appendChild(checkbox);
        li.appendChild(contentElement);
        li.appendChild(editBtn);
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

    taskInput.value = "";
    taskInput.focus();
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

