document.addEventListener("DOMContentLoaded", () => {
    const newTaskForm = document.getElementById("new-task-form");
    const upcomingTasksList = document.getElementById("upcoming-tasks-list");
    const completedTasksList = document.getElementById("completed-tasks-list");
    const lateTasksList = document.getElementById("late-tasks-list");

    // Load tasks from local storage
    loadTasks();

    // Periodically check for late tasks
    setInterval(checkForLateTasks, 60000); // Check every 60 seconds

    // Handle form submission
    newTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get task details from the form
        const taskTitle = document.getElementById("task-title").value;
        const taskDate = document.getElementById("task-date").value;
        const taskTime = document.getElementById("task-time").value;
        const taskCategory = document.getElementById("task-category").value;

        // Create a new task object
        const task = {
            id: Date.now(),
            title: taskTitle,
            date: taskDate,
            time: taskTime,
            category: taskCategory,
            completed: false,
        };

        // Save the task to local storage
        saveTaskToLocalStorage(task);

        // Add the task to the upcoming tasks list
        addTaskToDOM(task, false);

        // Clear the form
        newTaskForm.reset();
    });

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach((task) => {
            if (task.completed) {
                addTaskToDOM(task, true);
            } else if (checkIfTaskIsLate(task)) {
                addTaskToDOM(task, false, true); // Add to late tasks
            } else {
                addTaskToDOM(task, false);
            }
        });
    }

    // Function to add a task to the DOM
    function addTaskToDOM(task, isCompleted, isLate = false) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        taskItem.setAttribute("data-id", task.id);
        taskItem.classList.add(task.category === "work" ? "work-task" : "personal-task");
        taskItem.innerHTML = `
            <span class="task-title">${task.title}</span>
            <span class="task-datetime">${task.date} ${task.time}</span>
            <span class="task-category">[${task.category}]</span>
            ${!isCompleted && !isLate ? '<button class="mark-complete">Complete</button>' : ''}
        `;

        if (isCompleted) {
            const taskTitle = taskItem.querySelector(".task-title");
            taskTitle.style.textDecoration = "line-through";
            completedTasksList.appendChild(taskItem);
        } else if (isLate) {
            lateTasksList.appendChild(taskItem);
        } else {
            upcomingTasksList.appendChild(taskItem);

            // Add event listener to the "Complete" button
            const completeButton = taskItem.querySelector(".mark-complete");
            completeButton.addEventListener("click", () => {
                markTaskAsCompleted(task.id);
            });
        }
    }

    // Function to mark a task as completed
    function markTaskAsCompleted(taskId) {
        const tasks = getTasksFromLocalStorage();
        const taskIndex = tasks.findIndex((task) => task.id === taskId);

        if (taskIndex !== -1) {
            tasks[taskIndex].completed = true;
            saveTasksToLocalStorage(tasks);

            // Remove the task from the current list
            const taskItem = document.querySelector(`[data-id="${taskId}"]`);
            taskItem.remove();

            // Add the task to the completed tasks list
            addTaskToDOM(tasks[taskIndex], true);
        }
    }

    // Function to check if a task is late
    function checkIfTaskIsLate(task) {
        const taskDateTime = new Date(`${task.date}T${task.time}`);
        const now = new Date();
        return taskDateTime < now;
    }

    // Function to check for late tasks and move them to the "Late Tasks" section
    function checkForLateTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach((task) => {
            if (!task.completed && checkIfTaskIsLate(task)) {
                // Move the task to the "Late Tasks" section
                const taskItem = document.querySelector(`[data-id="${task.id}"]`);
                if (taskItem && taskItem.parentElement.id === "upcoming-tasks-list") {
                    taskItem.remove();
                    addTaskToDOM(task, false, true);
                }
            }
        });
    }

    // Function to get tasks from local storage
    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }

    // Function to save a task to local storage
    function saveTaskToLocalStorage(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        saveTasksToLocalStorage(tasks);
    }

    // Function to save all tasks to local storage
    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});

function addTaskToDOM(task, isCompleted, isLate = false) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.setAttribute("data-id", task.id);

    // Add category-specific class
    taskItem.classList.add(task.category === "work" ? "work-task" : "personal-task");

    // Add late-task class if the task is late
    if (isLate) {
        taskItem.classList.add("late-task");
    }

    taskItem.innerHTML = `
        <span class="task-title">${task.title}</span>
        <span class="task-datetime">${task.date} ${task.time}</span>
        <span class="task-category">[${task.category}]</span>
        ${!isCompleted && !isLate ? '<button class="mark-complete">Complete</button>' : ''}
    `;

    if (isCompleted) {
        const taskTitle = taskItem.querySelector(".task-title");
        taskTitle.style.textDecoration = "line-through";
        completedTasksList.appendChild(taskItem);
    } else if (isLate) {
        lateTasksList.appendChild(taskItem);
    } else {
        upcomingTasksList.appendChild(taskItem);

        // Add event listener to the "Complete" button
        const completeButton = taskItem.querySelector(".mark-complete");
        completeButton.addEventListener("click", () => {
            markTaskAsCompleted(task.id);
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const newNoteForm = document.getElementById("new-note-form");
    const notesList = document.getElementById("notes-list");

    // Load notes from local storage
    loadNotes();

    // Handle note submission
    newNoteForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get note content
        const noteContent = document.getElementById("note-content").value;

        // Create a new note object
        const note = {
            id: Date.now(),
            content: noteContent,
        };

        // Save the note to local storage
        saveNoteToLocalStorage(note);

        // Add the note to the notes list
        addNoteToDOM(note);

        // Clear the form
        newNoteForm.reset();
    });

    // Function to load notes from local storage
    function loadNotes() {
        const notes = getNotesFromLocalStorage();
        notes.forEach((note) => {
            addNoteToDOM(note);
        });
    }

    // Function to add a note to the DOM
    function addNoteToDOM(note) {
        const noteItem = document.createElement("li");
        noteItem.classList.add("note-item");
        noteItem.setAttribute("data-id", note.id);
        noteItem.innerHTML = `
            <span class="note-content">${note.content}</span>
            <button class="edit-note">Edit</button>
            <button class="delete-note">Delete</button>
        `;

        // Add event listener to the "Edit" button
        const editButton = noteItem.querySelector(".edit-note");
        editButton.addEventListener("click", () => {
            editNoteContent(note.id);
        });

        // Add event listener to the "Delete" button
        const deleteButton = noteItem.querySelector(".delete-note");
        deleteButton.addEventListener("click", () => {
            deleteNoteFromDOM(note.id);
        });

        notesList.appendChild(noteItem);
    }

    // Function to edit a note's content
    function editNoteContent(noteId) {
        const notes = getNotesFromLocalStorage();
        const noteIndex = notes.findIndex((note) => note.id === noteId);

        if (noteIndex !== -1) {
            const newContent = prompt("Edit your note:", notes[noteIndex].content);
            if (newContent !== null) {
                notes[noteIndex].content = newContent;
                saveNotesToLocalStorage(notes);

                // Update the DOM
                const noteItem = document.querySelector(`[data-id="${noteId}"] .note-content`);
                noteItem.textContent = newContent;
            }
        }
    }

    // Function to delete a note
    function deleteNoteFromDOM(noteId) {
        const notes = getNotesFromLocalStorage();
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        saveNotesToLocalStorage(updatedNotes);

        // Remove the note from the DOM
        const noteItem = document.querySelector(`[data-id="${noteId}"]`);
        if (noteItem) {
            noteItem.remove();
        }
    }

    // Function to get notes from local storage
    function getNotesFromLocalStorage() {
        return JSON.parse(localStorage.getItem("notes")) || [];
    }

    // Function to save a note to local storage
    function saveNoteToLocalStorage(note) {
        const notes = getNotesFromLocalStorage();
        notes.push(note);
        saveNotesToLocalStorage(notes);
    }

    // Function to save all notes to local storage
    function saveNotesToLocalStorage(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const dayButtons = document.querySelectorAll(".day-button");
    const selectedDayDisplay = document.getElementById("selected-day");

    // Handle day button clicks
    dayButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedDay = button.getAttribute("data-day");
            selectedDayDisplay.textContent = `Selected Day: ${selectedDay}`;
        });
    });
});

// filepath: /Users/zoekornhauser/iMacDoc/GitHub/Playground with AI/script.js
document.addEventListener("DOMContentLoaded", () => {
    const calendarGrid = document.getElementById("calendar-grid");
    const currentMonthYear = document.getElementById("current-month-year");
    const prevMonthButton = document.getElementById("prev-month");
    const nextMonthButton = document.getElementById("next-month");
    const taskDateInput = document.getElementById("task-date"); // Date input in the "New Task" section

    let currentDate = new Date();

    // Function to render the calendar
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Set the current month and year in the header
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        currentMonthYear.textContent = `${monthNames[month]} ${year}`;

        // Clear the calendar grid
        calendarGrid.innerHTML = `
            <div class="day-name">Sun</div>
            <div class="day-name">Mon</div>
            <div class="day-name">Tue</div>
            <div class="day-name">Wed</div>
            <div class="day-name">Thu</div>
            <div class="day-name">Fri</div>
            <div class="day-name">Sat</div>
        `;

        // Get the first day of the month and the number of days in the month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Get the number of days in the previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Add the days from the previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayElement = document.createElement("div");
            dayElement.classList.add("day", "inactive");
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        }

        // Add the days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            // Add click event to populate the task date input
            dayElement.addEventListener("click", () => {
                const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                taskDateInput.value = formattedDate; // Set the date in the "New Task" section
            });

            calendarGrid.appendChild(dayElement);
        }

        // Add the days from the next month to fill the grid
        const totalCells = calendarGrid.children.length;
        const remainingCells = 42 - totalCells; // 6 rows of 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day", "inactive");
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        }
    }

    // Event listeners for navigation buttons
    prevMonthButton.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthButton.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Initial render
    renderCalendar(currentDate);
});


document.addEventListener("DOMContentLoaded", () => {
    const backgroundMusic = document.getElementById("background-music");
    const playMusicButton = document.getElementById("play-music");
    const pauseMusicButton = document.getElementById("pause-music");
    const stopMusicButton = document.getElementById("stop-music");
    const progressBar = document.getElementById("progress-bar");
    const currentTimeDisplay = document.getElementById("current-time");
    const totalDurationDisplay = document.getElementById("total-duration");

    // Play music
    playMusicButton.addEventListener("click", () => {
        backgroundMusic.play();
    });

    // Pause music
    pauseMusicButton.addEventListener("click", () => {
        backgroundMusic.pause();
    });

    // Stop music
    stopMusicButton.addEventListener("click", () => {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reset to the beginning
    });

    // Update progress bar and time display
    backgroundMusic.addEventListener("timeupdate", () => {
        const currentTime = backgroundMusic.currentTime;
        const duration = backgroundMusic.duration;

        // Update progress bar
        progressBar.value = (currentTime / duration) * 100;

        // Update current time display
        currentTimeDisplay.textContent = formatTime(currentTime);

        // Update total duration display (once)
        if (!isNaN(duration)) {
            totalDurationDisplay.textContent = formatTime(duration);
        }
    });

    // Seek music when progress bar is changed
    progressBar.addEventListener("input", () => {
        const duration = backgroundMusic.duration;
        backgroundMusic.currentTime = (progressBar.value / 100) * duration;
    });

    // Format time in minutes and seconds
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }
});