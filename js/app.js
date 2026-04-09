// ================== GLOBAL VARIABLES ==================
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let quickLinks = JSON.parse(localStorage.getItem('quickLinks')) || [
  { name: "Google", url: "https://google.com" },
  { name: "Gmail", url: "https://gmail.com" },
  { name: "Calendar", url: "https://calendar.google.com" }
];
let timerInterval = null;
let timeLeft = 25 * 60; // detik
let isRunning = false;
let pomodoroTime = 25;

// ================== THEME & NAME ==================
function loadTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    document.getElementById('theme-toggle').textContent = '☀️';
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function editName() {
  const name = prompt("Masukkan nama kamu:", document.getElementById('user-name').textContent);
  if (name && name.trim() !== "") {
    document.getElementById('user-name').textContent = name.trim();
    localStorage.setItem('userName', name.trim());
  }
}

// ================== GREETING + TIME ==================
function updateClock() {
  const now = new Date();
  
  // Time
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
  
  // Date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
  
  // Greeting
  const hour = now.getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  else if (hour >= 18) greeting = "Good Evening";
  
  document.getElementById('greeting-text').textContent = greeting;
}

function loadName() {
  const savedName = localStorage.getItem('userName');
  if (savedName) document.getElementById('user-name').textContent = savedName;
}

// ================== TIMER ==================
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      alert("⏰ Waktu habis! Istirahat dulu ya 😊");
      resetTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = pomodoroTime * 60;
  updateTimerDisplay();
}

function changePomodoroTime() {
  const newTime = parseInt(document.getElementById('custom-minutes').value);
  if (newTime > 0 && newTime <= 60) {
    pomodoroTime = newTime;
    resetTimer();
    alert(`Pomodoro diubah menjadi ${newTime} menit`);
  }
}

// ================== TO-DO LIST ==================
function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleDone(${index})">
      <span class="task-text ${task.done ? 'done' : ''}">${task.text}</span>
      <button onclick="editTask(${index})">✏️</button>
      <button onclick="deleteTask(${index})">🗑️</button>
    `;
    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  
  if (!text) return;
  
  // Prevent duplicate
  if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
    alert("❌ Task ini sudah ada!");
    return;
  }
  
  tasks.push({ text: text, done: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  input.value = '';
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
}

function deleteTask(index) {
  if (confirm("Hapus task ini?")) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
}

// ================== QUICK LINKS ==================
function renderQuickLinks() {
  const container = document.getElementById('links-container');
  container.innerHTML = '';
  
  quickLinks.forEach((link, index) => {
    const btn = document.createElement('button');
    btn.textContent = link.name;
    btn.onclick = () => window.open(link.url, '_blank');
    container.appendChild(btn);
  });
}

function addQuickLink() {
  const name = document.getElementById('link-name').value.trim();
  const url = document.getElementById('link-url').value.trim();
  
  if (!name || !url) {
    alert("Isi nama dan URL dulu ya");
    return;
  }
  
  quickLinks.push({ name, url });
  localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
  
  document.getElementById('link-name').value = '';
  document.getElementById('link-url').value = '';
  renderQuickLinks();
}

// ================== INIT ==================
function init() {
  loadTheme();
  loadName();
  updateClock();
  setInterval(updateClock, 1000);
  
  updateTimerDisplay();
  renderTasks();
  renderQuickLinks();
}

window.onload = init;


// ================== RENDER TASKS (tombol di kanan) ==================
function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    
    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleDone(${index})">
        <span class="task-text ${task.done ? 'done' : ''}">${task.text}</span>
      </div>
      <div class="task-buttons">
        <button onclick="editTask(${index})" title="Edit">✏️</button>
        <button onclick="deleteTask(${index})" title="Hapus">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// ================== CUSTOM MODAL ==================
let currentEditIndex = null;
let currentAction = null;

function showModal(title, inputValue, confirmText, confirmCallback) {
  document.getElementById('modal-title').textContent = title;
  const input = document.getElementById('modal-input');
  input.value = inputValue || '';
  input.style.display = inputValue !== undefined ? 'block' : 'none';
  
  const confirmBtn = document.getElementById('modal-confirm-btn');
  confirmBtn.textContent = confirmText;
  confirmBtn.onclick = confirmCallback;
  
  document.getElementById('modal').style.display = 'flex';
}

function hideModal() {
  document.getElementById('modal').style.display = 'none';
  currentEditIndex = null;
  currentAction = null;
}

// Edit Nama
function editName() {
  showModal(
    "Ubah Nama Kamu",
    document.getElementById('user-name').textContent,
    "Simpan",
    () => {
      const newName = document.getElementById('modal-input').value.trim();
      if (newName) {
        document.getElementById('user-name').textContent = newName;
        localStorage.setItem('userName', newName);
      }
      hideModal();
    }
  );
}

// Edit Task
function editTask(index) {
  currentEditIndex = index;
  showModal(
    "Edit Task",
    tasks[index].text,
    "Simpan",
    () => {
      const newText = document.getElementById('modal-input').value.trim();
      if (newText) {
        tasks[index].text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
      }
      hideModal();
    }
  );
}

// Delete Task
function deleteTask(index) {
  currentEditIndex = index;
  showModal(
    "Hapus Task?",
    undefined,           // tidak pakai input
    "Hapus",
    () => {
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      hideModal();
    }
  );
}