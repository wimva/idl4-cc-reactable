import videoSourceSelector from './video-source-selector';
import markerSynth, {loopSynth} from './marker-synth';
import markerRed from './marker-red';
import markerGreen from './marker-green';
import markerBlue from './marker-blue';
import markerDriver, {loopDriver} from './marker-driver';
import markerBlack from './marker-black';
import * as Tone from 'tone';

const camera = document.querySelector('[camera]');

const markerGreenElement = document.querySelector('#marker-green');
const markerYellowElement = document.querySelector('#marker-yellow');
const markerRedElement = document.querySelector('#marker-red');
const markerBlueElement = document.querySelector('#marker-blue');
const markerWhiteElement = document.querySelector('#marker-white');
const markerBlackElement = document.querySelector('#marker-black');

const canvas = document.querySelector("#drawboard");

const startButton = document.querySelector('#start-button');
const startOverlay = document.querySelector('#start-overlay');

// initiate ar js
window.addEventListener('arjs-video-loaded', () => {
  startButton.style.display = 'block';

  videoSourceSelector();
});

// start the reactable
startButton.onclick = async () => {
  await Tone.start();

  startOverlay.style.display = 'none';

  markerSynth(markerYellowElement);
  markerRed(markerRedElement);
  markerGreen(markerGreenElement);
  markerBlue(markerBlueElement);
  markerDriver(markerWhiteElement);
  markerBlack(markerBlackElement);
};

// resize the canvas
function setCanvasSize () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

// draw loop
let ctx = canvas.getContext("2d");
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw the correct markers
  const driverMarker = loopDriver(canvas, ctx);
  loopSynth(canvas, ctx, driverMarker);

  // Request another frame
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 10)
}
draw();