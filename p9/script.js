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
