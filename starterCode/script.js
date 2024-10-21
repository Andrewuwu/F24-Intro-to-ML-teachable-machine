const URL = "https://teachablemachine.withgoogle.com/models/JNy1-w9nc/";

let model, webcam, labelContainer, maxPredictions, squareElement;
let squareXPosition = 50;
let obstacles = [];
let animationFrameId;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup();

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  await webcam.play();
  animationFrameId = window.requestAnimationFrame(loop);

  const webcamContainer = document.getElementById("webcam-container");
  webcamContainer.appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
  document.getElementById("btn").setAttribute("disabled", "true");
  squareElement = document.getElementById("moving-square");
  initializeObstacles();
}

// Main loop to update webcam feed and predictions
async function loop() {
  // TODO
}

async function predict() {
  // TODO
}

function initializeObstacles() {
  const obstacleElements = document.querySelectorAll(".obstacle");
  obstacleElements.forEach((obstacle) => {
    obstacles.push(obstacle);
  });
}

function reset() {
  squareElement.style.left = 50 + "%";
  obstacles.forEach((obstacle) => {
    obstacle.style.top = "-10%";
    obstacle.style.left = Math.random() * 90 + "%";
  });
  document.getElementById("btn").removeAttribute("disabled");
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  const webcamContainer = document.getElementById("webcam-container");
  if (webcamContainer.hasChildNodes()) {
    while (webcamContainer.firstChild) {
      webcamContainer.removeChild(webcamContainer.firstChild);
    }
  }
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    let obstacleY = parseFloat(obstacle.style.top) || 0;
    obstacleY += 0.5;

    if (obstacleY > 100) {
      obstacleY = -10;
      obstacle.style.left = Math.random() * 90 + "%";
    }
    obstacle.style.top = obstacleY + "%";
  });
}
function checkCollision() {
  const squareX = parseFloat(squareElement.style.left);
  const squareY = 80;

  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    const obstacleX = parseFloat(obstacle.style.left);
    const obstacleY = parseFloat(obstacle.style.top);

    if (
      squareX < obstacleX + 8 &&
      squareX > obstacleX - 3 &&
      squareY < obstacleY + 8 &&
      squareY > obstacleY - 3.5
    ) {
      // console.log(squareX, squareY, obstacleX, obstacleY);
      return true;
    }
  }
  return false;
}

function moveSquare(prediction) {
  const squareWidth = 50;
  const parentWidth = squareElement.parentElement.offsetWidth;

  const squareHalfWidthPercent = (squareWidth / 2 / parentWidth) * 100;

  if (prediction === "Left") {
    squareXPosition -= 0.5;
  } else if (prediction === "Right") {
    squareXPosition += 0.5;
  }

  if (squareXPosition < squareHalfWidthPercent)
    squareXPosition = squareHalfWidthPercent;
  if (squareXPosition > 100 - squareHalfWidthPercent)
    squareXPosition = 100 - squareHalfWidthPercent;

  squareElement.style.left = squareXPosition + "%";
}
