const storageKey = "daymark-tasks";
const colors = ["#b9d4c0", "#e68b72", "#c6bee4", "#f4c966"];
let tasks = JSON.parse(localStorage.getItem(storageKey) || "[]");
let selectedDate = new Date();
let editingTaskId = null;
let filter = "all";

const datePicker = document.querySelector("#datePicker");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const dialog = document.querySelector("#taskDialog");
const taskForm = document.querySelector("#taskForm");
const themeToggle = document.querySelector("#themeToggle");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const darkMode = theme === "dark";
  themeToggle.textContent = darkMode ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    darkMode ? "Switch to light theme" : "Switch to dark theme",
  );
  themeToggle.setAttribute(
    "title",
    darkMode ? "Switch to light theme" : "Switch to dark theme",
  );
}

applyTheme(localStorage.getItem("daymark-theme") || "light");
themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("daymark-theme", nextTheme);
  applyTheme(nextTheme);
});

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const dateFromKey = (key) => new Date(`${key}T12:00:00`);
const selectedKey = () => toDateKey(selectedDate);
const saveTasks = () => localStorage.setItem(storageKey, JSON.stringify(tasks));
const formatTime = (time) => {
  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

function renderDates() {
  datePicker.innerHTML = "";
  const start = new Date(selectedDate);
  start.setDate(start.getDate() - 3);
  for (let index = 0; index < 7; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const button = document.createElement("button");
    const key = toDateKey(date);
    button.className = `date-item ${key === selectedKey() ? "selected" : ""} ${key === toDateKey(new Date()) ? "today" : ""}`;
    button.innerHTML = `<small>${date.toLocaleDateString([], { weekday: "short" })}</small><strong>${date.getDate()}</strong>`;
    button.addEventListener("click", () => {
      selectedDate = date;
      render();
    });
    datePicker.appendChild(button);
  }
}

function renderTasks() {
  const dayTasks = tasks
    .filter((task) => task.date === selectedKey())
    .filter(
      (task) =>
        filter === "all" || (filter === "open" ? !task.done : task.done),
    )
    .sort((a, b) => a.time.localeCompare(b.time));
  taskList.innerHTML = "";
  emptyState.hidden = dayTasks.length > 0;
  dayTasks.forEach((task) => {
    const row = document.createElement("article");
    row.className = "task-row";
    row.innerHTML = `<time class="task-time">${formatTime(task.time)}</time><span class="task-marker" style="border-color:${task.color}"></span><div class="task-card ${task.done ? "done" : ""}" style="--task-color:${task.color}"><h3>${escapeHtml(task.title)}</h3>${task.description ? `<p>${escapeHtml(task.description)}</p>` : ""}<div class="task-actions"><button type="button" data-action="toggle" aria-label="${task.done ? "Mark incomplete" : "Complete task"}">${task.done ? "↶" : "✓"}</button><button type="button" data-action="edit" aria-label="Edit task">✎</button><button type="button" data-action="delete" aria-label="Delete task">×</button></div></div>`;
    row
      .querySelectorAll("[data-action]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          handleTaskAction(button.dataset.action, task.id),
        ),
      );
    taskList.appendChild(row);
  });
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function handleTaskAction(action, id) {
  const task = tasks.find((item) => item.id === id);
  if (action === "toggle") task.done = !task.done;
  if (action === "delete") tasks = tasks.filter((item) => item.id !== id);
  if (action === "edit") openComposer(task);
  if (action !== "edit") {
    saveTasks();
    render();
  }
}

function openComposer(task = null) {
  editingTaskId = task?.id || null;
  document.querySelector("#dialogTitle").textContent = task
    ? "Edit task"
    : "Add a task";
  document.querySelector("#taskTitle").value = task?.title || "";
  document.querySelector("#taskDate").value = task?.date || selectedKey();
  document.querySelector("#taskTime").value = task?.time || "09:00";
  document.querySelector("#taskDescription").value = task?.description || "";
  dialog.showModal();
  document.querySelector("#taskTitle").focus();
}

taskForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "default") return;
  event.preventDefault();
  const formData = new FormData(taskForm);
  const existing = tasks.find((task) => task.id === editingTaskId);
  const task = {
    id: editingTaskId || Date.now(),
    title: formData.get("title").trim(),
    date: formData.get("date"),
    time: formData.get("time"),
    description: formData.get("description").trim(),
    done: existing?.done || false,
    color: existing?.color || colors[tasks.length % colors.length],
  };
  tasks = editingTaskId
    ? tasks.map((item) => (item.id === editingTaskId ? task : item))
    : [...tasks, task];
  selectedDate = dateFromKey(task.date);
  saveTasks();
  dialog.close();
  render();
});

function renderInsights() {
  const dayTasks = tasks.filter((task) => task.date === selectedKey());
  const completed = dayTasks.filter((task) => task.done).length;
  const percent = dayTasks.length
    ? Math.round((completed / dayTasks.length) * 100)
    : 0;
  document.querySelector("#progressPercent").textContent = `${percent}%`;
  document.querySelector("#progressBar").style.width = `${percent}%`;
  document.querySelector("#progressLabel").textContent =
    percent === 100
      ? "Day well spent"
      : percent
        ? "You are moving"
        : "A fresh start";
  document.querySelector("#progressMessage").textContent = dayTasks.length
    ? `${completed} of ${dayTasks.length} tasks complete.`
    : "Every completed task counts.";
  document.querySelector("#taskSummary").textContent = dayTasks.length
    ? `${completed} completed · ${dayTasks.length - completed} remaining`
    : "Your tasks will appear here.";
  document.querySelector("#todayCount").textContent = tasks.filter(
    (task) => task.date === toDateKey(new Date()) && !task.done,
  ).length;
  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
  let weekCompleted = 0;
  let weekTotal = 0;
  const bars = document.querySelector("#weekBars");
  bars.innerHTML = "";
  for (let index = 0; index < 7; index += 1) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const dayTasksForBar = tasks.filter(
      (task) => task.date === toDateKey(date),
    );
    const done = dayTasksForBar.filter((task) => task.done).length;
    weekCompleted += done;
    weekTotal += dayTasksForBar.length;
    const wrap = document.createElement("div");
    wrap.className = "bar-wrap";
    wrap.innerHTML = `<span class="bar ${toDateKey(date) === selectedKey() ? "current" : ""}" style="height:${Math.max(7, dayTasksForBar.length ? (done / dayTasksForBar.length) * 52 : 7)}px"></span><span class="bar-label">${date.toLocaleDateString([], { weekday: "narrow" })}</span>`;
    bars.appendChild(wrap);
  }
  document.querySelector("#weekScore").textContent =
    `${weekCompleted}/${weekTotal}`;
}

function render() {
  document.querySelector("#longDate").textContent =
    selectedDate.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  document.querySelector("#scheduleTitle").textContent =
    selectedKey() === toDateKey(new Date())
      ? "Today's schedule"
      : `${selectedDate.toLocaleDateString([], { weekday: "long" })}'s schedule`;
  renderDates();
  renderTasks();
  renderInsights();
}

document
  .querySelector("#openComposer")
  .addEventListener("click", () => openComposer());
document
  .querySelector("#emptyAdd")
  .addEventListener("click", () => openComposer());
document.querySelector("#previousDay").addEventListener("click", () => {
  selectedDate.setDate(selectedDate.getDate() - 1);
  render();
});
document.querySelector("#nextDay").addEventListener("click", () => {
  selectedDate.setDate(selectedDate.getDate() + 1);
  render();
});
document.querySelector("#filterButton").addEventListener("click", () => {
  filter = filter === "all" ? "open" : filter === "open" ? "done" : "all";
  document.querySelector("#filterButton").firstChild.textContent =
    `${filter === "all" ? "All tasks" : filter === "open" ? "Open tasks" : "Completed"} `;
  renderTasks();
});
render();
