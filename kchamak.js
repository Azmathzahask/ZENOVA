function addTask() {
    let taskInput = document.getElementById("task");
    let categorySelect = document.getElementById("taskCategory");

    if (!taskInput || !categorySelect) {
        console.error("One or more required elements are missing");
        return;
    }

    let taskText = taskInput.value.trim();
    let taskCategory = categorySelect.value;

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    let categoryContainer = document.getElementById(taskCategory);
    if (!categoryContainer) {
        console.error(`Category container ${taskCategory} not found`);
        return;
    }

    let taskContainer = categoryContainer.querySelector(".task-container");
    if (!taskContainer) {
        console.error(`Task container not found in ${taskCategory}`);
        return;
    }

    // Create a task div
    let taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.id = `task-${Date.now()}`;
    taskElement.draggable = true;
    taskElement.ondragstart = drag;

    // Create a checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.onclick = function () {
        if (this.checked) {
            document.getElementById("completed").querySelector(".task-container").appendChild(taskElement);
            taskElement.classList.add('completed');
        } else {
            document.getElementById(taskCategory).querySelector(".task-container").appendChild(taskElement);
            taskElement.classList.remove('completed');
        }
    };

    // Create a span for task text
    let taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    // Create a delete button for individual tasks
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = "delete-task-btn";
    deleteBtn.onclick = function () {
        if (confirm("Are you sure you want to delete this task?")) {
            taskElement.remove();
        }
    };

    // Append checkbox, text, and delete button to the task div
    taskElement.appendChild(checkbox);
    taskElement.appendChild(taskSpan);
    taskElement.appendChild(deleteBtn);

    // Append the task to the selected category
    taskContainer.appendChild(taskElement);

    // Clear input field
    taskInput.value = "";
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}
