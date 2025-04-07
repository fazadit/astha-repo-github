import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
  getMessaging,
  getToken
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDCCy9lVrewr3EraM_Sua7h8LXvJBr8Xhc",
  authDomain: "astha-project-8048f.firebaseapp.com",
  databaseURL: "https://astha-project-8048f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "astha-project-8048f",
  storageBucket: "astha-project-8048f.appspot.com",
  messagingSenderId: "801380674010",
  appId: "1:801380674010:web:7891588156219fb21078e3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messaging = getMessaging(app);

// 🔐 User ID unik lokal
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("userId", userId);
}

// Tambah tugas
function addTask() {
  const taskInput = document.getElementById("task-input");
  const deadlineInput = document.getElementById("deadline-input");

  if (!taskInput.value.trim()) return;

  const deadlineDate = deadlineInput.value ? new Date(deadlineInput.value) : null;
  const deadlineTimestamp = deadlineDate ? deadlineDate.getTime() : null;
  const deadlineFormatted = deadlineDate
    ? deadlineDate.toLocaleString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Tanpa Deadline";

  const newTaskRef = push(ref(db, "todolist/" + userId));
  set(newTaskRef, {
    id: newTaskRef.key,
    task: taskInput.value.trim(),
    deadline: deadlineTimestamp,
    deadlineFormatted: deadlineFormatted,
    completed: false,
    notifSent: false
  });

  taskInput.value = "";
  deadlineInput.value = "";
}

// Toggle tugas selesai
function toggleTask(taskId, isCompleted) {
  update(ref(db, "todolist/" + userId + "/" + taskId), {
    completed: isCompleted
  });
}

// Hapus tugas
function deleteTask(taskId) {
  remove(ref(db, "todolist/" + userId + "/" + taskId));
}

// Tampilkan tugas
function loadTasks() {
  const taskList = document.getElementById("task-list");
  onValue(ref(db, "todolist/" + userId), (snapshot) => {
    taskList.innerHTML = "";

    if (!snapshot.exists()) {
      taskList.innerHTML = '<p class="text-center text-gray-500">Belum ada tugas.</p>';
      return;
    }

    snapshot.forEach((childSnapshot) => {
      const taskData = childSnapshot.val();

      const li = document.createElement("li");
      li.className = "flex items-center justify-between bg-white p-3 rounded-lg shadow-md";

      const left = document.createElement("div");
      left.className = "flex items-center";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = taskData.completed;
      checkbox.className = "mr-3 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded";
      checkbox.addEventListener("change", () => {
        toggleTask(taskData.id, checkbox.checked);
      });

      const content = document.createElement("div");
      content.innerHTML = `
        <p class="font-medium ${taskData.completed ? "line-through text-gray-500" : ""}">
          ${taskData.task}
        </p>
        <p class="text-sm text-gray-500">${taskData.deadlineFormatted || "Tanpa Deadline"}</p>
      `;

      left.appendChild(checkbox);
      left.appendChild(content);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Hapus";
      deleteBtn.className = "text-red-500 hover:text-red-700";
      deleteBtn.onclick = () => deleteTask(taskData.id);

      li.appendChild(left);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  });
}

// Load saat halaman dibuka
window.onload = loadTasks;

// Request izin notifikasi
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    navigator.serviceWorker
      .register("firebase-messaging-sw.js")
      .then((registration) => {
        getToken(messaging, {
          vapidKey: "BMdt3BZc0Fvc-FKH0VrfoRQD9TMIpF7OGvUXPqDS-nHUgksvzQ_NiH-IoRopF_p1yO4_RhuLf0hbJHGT-mkXFeA",
          serviceWorkerRegistration: registration
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log("Token FCM:", currentToken);
            } else {
              console.log("No registration token available.");
            }
          })
          .catch((err) => console.error("Token error:", err));
      })
      .catch((err) => console.error("SW registration error:", err));
  } else {
    console.log("Notification permission denied.");
  }
});

// Ekspor fungsi
window.addTask = addTask;
window.deleteTask = deleteTask;
