let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function updateStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgress();
}

function updateProgress() {
  const completed = tasks.filter((task) => task.completed).length;
  const progress = (completed / tasks.length) * 100 || 0;
  document.querySelector(".progress-fill").style.width = `${progress}%`;
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  if (taskInput.value.trim()) {
    const task = {
      id: Date.now(),
      text: taskInput.value.trim(),
      priority,
      dueDate,
      completed: false,
      createdAt: new Date(),
    };

    tasks.push(task);
    renderTasks();
    taskInput.value = "";
    updateStorage();
  }
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const filter = document.getElementById("filter").value;
  const searchQuery = document.getElementById("search").value.toLowerCase();

  taskList.innerHTML = "";

  const filteredTasks = tasks
    .filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && task.completed) ||
        (filter === "active" && !task.completed);
      const matchesSearch = task.text.toLowerCase().includes(searchQuery);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
    taskItem.innerHTML = `
          <div class="priority-indicator ${task.priority}"></div>
          <div class="task-content">
            ${task.text}
            ${
              task.dueDate
                ? `<span class="due-date">📅 ${new Date(
                    task.dueDate
                  ).toLocaleDateString()}</span>`
                : ""
            }
          </div>
          <div class="task-actions">
            <button onclick="toggleComplete(${task.id})" class="complete-btn">
              ${task.completed ? "✅" : "⚪"}
            </button>
            <button onclick="editTask(${task.id})" class="edit-btn">✏️</button>
            <button onclick="deleteTask(${
              task.id
            })" class="delete-btn">🗑️</button>
          </div>
        `;
    taskList.appendChild(taskItem);
  });
}

function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
  updateStorage();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
  updateStorage();
}

function editTask(id) {
  const task = tasks.find((task) => task.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText) {
    task.text = newText.trim();
    renderTasks();
    updateStorage();
  }
}

function clearAll() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    renderTasks();
    updateStorage();
  }
}

// Event Listeners
document.getElementById("filter").addEventListener("change", renderTasks);
document.getElementById("search").addEventListener("input", renderTasks);
document.getElementById("taskInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Initial render
renderTasks();
updateProgress();
