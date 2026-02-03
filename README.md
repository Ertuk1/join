🗂️ Kanban Board – Task Management App
A lightweight, browser‑based Kanban Board built with HTML, CSS, and JavaScript, featuring task creation with urgency levels (High / Mid / Low) and dynamic status management.
The project uses Firebase as a backend for real‑time data storage and synchronization.

🚀 Features
📝 Task Creation
Add new tasks with:

Title

Description

Assigned urgency (High / Mid / Low)

Category or assignee 

📌 Kanban Workflow
Drag & drop tasks between:

To Do

In Progress

Awaiting Feedback

Done

🔥 Firebase Integration
Real‑time database storage

Automatic syncing across sessions

Persistent task data

Secure backend structure

🎨 UI/UX
Clean, responsive layout

Color‑coded urgency levels

Smooth drag‑and‑drop interactions

Mobile‑friendly design

🛠️ Tech Stack
Layer	Technology
Frontend	HTML, CSS, JavaScript
Backend	Firebase Realtime Database
Storage	Firebase
Deployment	GitHub Pages (optional)
📦 Installation & Setup
1. Clone the repository
bash
git clone https://github.com/yourusername/your-kanban-board.git
cd your-kanban-board
2. Configure Firebase
Create a Firebase project and add your config snippet:

js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
Place it inside your Firebase initialization file.

3. Start the app
Simply open index.html in your browser.


🧩4. How It Works
User creates a task

Task is saved to Firebase

UI renders tasks based on their status

Drag & drop updates the task’s status in Firebase

All changes sync instantly across sessions
