# Fancy To-Do List

## Overview
The Fancy To-Do List is a web application designed to help users manage their tasks efficiently. It includes features for organizing tasks into work and personal categories, setting reminders, and tracking completed tasks with visual indicators.

## Features
- **Task Management**: Add, edit, and delete tasks.
- **Categories**: Separate tasks into Work and Personal sections.
- **Reminders**: Set reminders for tasks with date and time.
- **Completed Tasks**: Mark tasks as completed with a strikethrough effect.
- **Background Music**: Play background music with options to turn it on or off.
- **Alarms**: Set alarms for specific tasks to receive notifications.

## Project Structure
```
fancy-todo-list
├── src
│   ├── assets
│   │   ├── css
│   │   │   └── styles.css
│   │   ├── js
│   │   │   └── script.js
│   │   └── audio
│   │       └── background-music.mp3
│   ├── components
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── task-item.html
│   ├── pages
│   │   ├── index.html
│   │   └── about.html
│   └── utils
│       └── alarm.js
├── package.json
├── README.md
└── .gitignore
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd fancy-todo-list
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Open `src/pages/index.html` in your web browser to view the application.

## Usage
- To add a new task, enter the task details in the input field and click "Add Task".
- Use the options to categorize tasks as Work or Personal.
- Set reminders by selecting a date and time for each task.
- Mark tasks as completed by clicking the checkbox next to the task.
- Control the background music using the provided toggle button.
- Set alarms for tasks to receive notifications.

## License
This project is licensed under the MIT License.