import videoSourceSelector from './video-source-selector';
import markerDriver, {loopDriver} from './marker-driver';
import MarkerSynth from './marker-synth';
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

let synth1 = null;
let synth2 = null;
let synth3 = null;

// initiate ar js
window.addEventListener('arjs-video-loaded', () => {
  startButton.style.display = 'block';

  videoSourceSelector();
});

// start the reactable
startButton.onclick = async () => {
  await Tone.start();

  startOverlay.style.display = 'none';
  
  markerDriver(markerWhiteElement);
  synth1 = new MarkerSynth(markerYellowElement);
  synth2 = new MarkerSynth(markerRedElement);
  synth3 = new MarkerSynth(markerBlueElement);

  // markerGreen(markerGreenElement);
  // markerBlack(markerBlackElement);

  draw();
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
  const instruments = [
    synth1.loopSynth(canvas, ctx, driverMarker),
    synth2.loopSynth(canvas, ctx, driverMarker),
    synth3.loopSynth(canvas, ctx, driverMarker),
  ];

  // Request another frame
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 10)
}
