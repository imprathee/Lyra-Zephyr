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
