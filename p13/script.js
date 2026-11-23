// ===== P9: Animations =====
function setupInfoCard(buttonId, cardId) {
  const button = document.getElementById(buttonId);
  const card = document.getElementById(cardId);

  button.addEventListener("click", function () {
    card.classList.toggle("open");
  });
}

setupInfoCard("medical-button", "medical-info");
setupInfoCard("food-button", "food-info");
setupInfoCard("parcel-button", "parcel-info");

const processButton = document.getElementById("process-button");
const processSteps = document.getElementById("process-steps");

processButton.addEventListener("click", function () {
  processSteps.classList.toggle("closed");
});

const notifyButton = document.getElementById("notify-button");
const notification = document.getElementById("notification");

notifyButton.addEventListener("click", function () {
  notification.classList.add("show");

  setTimeout(function () {
    notification.classList.remove("show");
  }, 3000);
});

// ===== P10: DOM deliveries =====
const destinationInput = document.getElementById("destination");
const addButton = document.getElementById("add-button");
const deliveryList = document.querySelector("#delivery-list");
const deliveryCount = document.getElementById("delivery-count");
const deliveryMessage = document.getElementById("delivery-message");
let totalDeliveries = 0;

function updateCount() {
  deliveryCount.innerHTML = "Total deliveries: " + totalDeliveries;
}

addButton.addEventListener("click", function () {
  const destination = destinationInput.value.trim();

  if (destination === "") {
    deliveryMessage.textContent = "Please enter a destination.";
    return;
  }

  const item = document.createElement("li");
  const label = document.createElement("span");
  const buttonGroup = document.createElement("div");
  const deliveredButton = document.createElement("button");
  const removeButton = document.createElement("button");

  label.textContent = destination + " - Pending";
  buttonGroup.setAttribute("class", "item-buttons");
  deliveredButton.textContent = "Mark Delivered";
  removeButton.textContent = "Remove";

  deliveredButton.addEventListener("click", function () {
    label.textContent = destination + " - Delivered";
    item.setAttribute("class", "delivered");
    deliveredButton.remove();
    deliveryMessage.textContent = "Delivery to " + destination + " completed.";
  });

  removeButton.addEventListener("click", function () {
    item.remove();
    totalDeliveries = totalDeliveries - 1;
    updateCount();
    deliveryMessage.textContent = "Delivery to " + destination + " removed.";
  });

  buttonGroup.appendChild(deliveredButton);
  buttonGroup.appendChild(removeButton);
  item.appendChild(label);
  item.appendChild(buttonGroup);
  deliveryList.appendChild(item);

  totalDeliveries = totalDeliveries + 1;
  updateCount();
  deliveryMessage.textContent = "Delivery to " + destination + " added.";
  destinationInput.value = "";
});

// ===== P11: Form validation =====
const bookingForm = document.getElementById("booking-form");
const formSuccess = document.getElementById("form-success");
const dateInput = document.getElementById("date");

const fieldMessages = {
  fullname: "Enter a name of 3 to 40 letters (letters and spaces only).",
  email: "Enter a valid email address.",
  phone: "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.",
  password: "Use 8 to 20 characters with at least one letter and one number.",
  weight: "Weight must be between 1 and 25 kg.",
  date: "Choose today or a future date.",
  package: "Please select a package type."
};

function checkDate() {
  const today = new Date().toLocaleDateString("en-CA");

  if (dateInput.value !== "" && dateInput.value < today) {
    dateInput.setCustomValidity("Delivery date cannot be in the past.");
  } else {
    dateInput.setCustomValidity("");
  }
}

function checkField(id) {
  const field = document.getElementById(id);
  const error = document.getElementById(id + "-error");

  if (id === "date") {
    checkDate();
  }

  if (field.checkValidity()) {
    error.textContent = "";
    return true;
  }

  error.textContent = fieldMessages[id];
  return false;
}

for (const id in fieldMessages) {
  document.getElementById(id).addEventListener("blur", function () {
    checkField(id);
  });
}

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();
  formSuccess.textContent = "";

  let allValid = true;
  for (const id in fieldMessages) {
    if (!checkField(id)) {
      allValid = false;
    }
  }

  if (!allValid) {
    bookingForm.reportValidity();
    return;
  }

  bookingForm.reset();
  formSuccess.textContent = "Thank you! Your delivery has been booked successfully.";
});

bookingForm.addEventListener("reset", function () {
  formSuccess.textContent = "";
  for (const id in fieldMessages) {
    document.getElementById(id + "-error").textContent = "";
  }
});

// ===== P12: API data =====
const loadButton = document.getElementById("load-button");
const statusMessage = document.getElementById("status-message");
const clientTableBody = document.getElementById("client-table-body");

async function loadClients() {
  statusMessage.textContent = "Loading clients...";
  clientTableBody.textContent = "";
  loadButton.disabled = true;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const clients = await response.json();

    for (let i = 0; i < clients.length; i++) {
      const row = document.createElement("tr");
      const values = [
        clients[i].name,
        clients[i].address.city,
        clients[i].company.name,
        clients[i].email
      ];

      for (let j = 0; j < values.length; j++) {
        const cell = document.createElement("td");
        cell.textContent = values[j];
        row.appendChild(cell);
      }

      clientTableBody.appendChild(row);
    }

    statusMessage.textContent = "Loaded " + clients.length + " clients.";
  } catch (error) {
    statusMessage.textContent = "Could not load data. Check your internet connection and try again.";
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadClients);

// ===== P13: Task manager =====
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDrone = document.getElementById("task-drone");
const taskPriority = document.getElementById("task-priority");
const taskNotes = document.getElementById("task-notes");
const taskSaveButton = document.getElementById("task-save-button");
const taskTableBody = document.getElementById("task-table-body");

const statuses = ["Pending", "In Progress", "Completed"];
let tasks = [];
let editingId = null;

const savedTasks = localStorage.getItem("lyraTasks");
if (savedTasks !== null) {
  tasks = JSON.parse(savedTasks);
}

function saveTasks() {
  localStorage.setItem("lyraTasks", JSON.stringify(tasks));
}

function changeStatus(id) {
  const task = tasks.find(function (item) {
    return item.id === id;
  });
  const nextIndex = (statuses.indexOf(task.status) + 1) % statuses.length;
  task.status = statuses[nextIndex];
  saveTasks();
  showTasks();
}

function editTask(id) {
  const task = tasks.find(function (item) {
    return item.id === id;
  });
  taskTitle.value = task.title;
  taskDrone.value = task.drone;
  taskPriority.value = task.priority;
  taskNotes.value = task.notes;
  editingId = id;
  taskSaveButton.textContent = "Update Task";
  taskTitle.focus();
}

function deleteTask(id) {
  tasks = tasks.filter(function (item) {
    return item.id !== id;
  });
  saveTasks();
  showTasks();
}

function showTasks() {
  taskTableBody.textContent = "";

  tasks.forEach(function (task) {
    const row = document.createElement("tr");
    const values = [task.title, task.drone, task.priority, task.notes, task.status];

    values.forEach(function (value) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const actionGroup = document.createElement("div");
    const statusButton = document.createElement("button");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    actionGroup.setAttribute("class", "task-actions");
    statusButton.textContent = "Next Status";
    editButton.textContent = "Edit";
    deleteButton.textContent = "Delete";

    statusButton.addEventListener("click", function () {
      changeStatus(task.id);
    });
    editButton.addEventListener("click", function () {
      editTask(task.id);
    });
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    actionGroup.appendChild(statusButton);
    actionGroup.appendChild(editButton);
    actionGroup.appendChild(deleteButton);
    actionCell.appendChild(actionGroup);
    row.appendChild(actionCell);
    taskTableBody.appendChild(row);
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (editingId === null) {
    tasks.push({
      id: Date.now(),
      title: taskTitle.value,
      drone: taskDrone.value,
      priority: taskPriority.value,
      notes: taskNotes.value,
      status: "Pending"
    });
  } else {
    const task = tasks.find(function (item) {
      return item.id === editingId;
    });
    task.title = taskTitle.value;
    task.drone = taskDrone.value;
    task.priority = taskPriority.value;
    task.notes = taskNotes.value;
    editingId = null;
  }

  saveTasks();
  showTasks();
  taskForm.reset();
});

taskForm.addEventListener("reset", function () {
  editingId = null;
  taskSaveButton.textContent = "Add Task";
});

showTasks();
