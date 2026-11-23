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
