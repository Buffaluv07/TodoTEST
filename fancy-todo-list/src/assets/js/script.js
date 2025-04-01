// This file contains the main JavaScript logic for the application. It handles adding new tasks, marking tasks as completed (with strikethrough), managing reminders, and controlling the background music playback.

const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const timeInput = document.getElementById('time-input');
const reminderInput = document.getElementById('reminder-input');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = new Audio('assets/audio/background-music.mp3');
let tasks = [];

function addTask() {
    const taskText = taskInput.value;
    const taskDate = dateInput.value;
    const taskTime = timeInput.value;
    const taskReminder = reminderInput.checked;

    if (taskText) {
        const task = {
            text: taskText,
            date: taskDate,
            time: taskTime,
            reminder: taskReminder,
            completed: false,
        };
        tasks.push(task);
        renderTasks();
        taskInput.value = '';
        dateInput.value = '';
        timeInput.value = '';
        reminderInput.checked = false;
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.text} - ${task.date} ${task.time}</span>
            <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="removeTask(${index})">Remove</button>
        `;
        taskList.appendChild(taskItem);
    });
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function removeTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

musicToggle.addEventListener('change', () => {
    if (musicToggle.checked) {
        backgroundMusic.loop = true;
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
});

// Event listener for adding tasks
document.getElementById('add-task-button').addEventListener('click', addTask);