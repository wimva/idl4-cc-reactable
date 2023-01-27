import videoSourceSelector from './video-source-selector';
import markerDriver, {loopDriver} from './marker-driver';
import MarkerSynth from './marker-synth';
import MarkerPluck from './marker-pluck';
import MarkerDrum from './marker-drum';
import MarkerEffect from './marker-effect';
import * as Tone from 'tone';

const camera = document.querySelector('[camera]');

const marker0Element = document.querySelector('#marker-0');
const marker1Element = document.querySelector('#marker-1');
const marker2Element = document.querySelector('#marker-2');
const marker3Element = document.querySelector('#marker-3');
const marker4Element = document.querySelector('#marker-4');
const marker5Element = document.querySelector('#marker-5');
const marker6Element = document.querySelector('#marker-6');

const canvas = document.querySelector("#drawboard");

const startButton = document.querySelector('#start-button');
const startOverlay = document.querySelector('#start-overlay');

let synth1 = null;
let synth2 = null;
let drum1 = null;
let drum2 = null;
let pluck1 = null;
let effect1 = null;

// initiate ar js
window.addEventListener('arjs-video-loaded', () => {
  startButton.style.display = 'block';

  videoSourceSelector();
});

// start the reactable
startButton.onclick = async () => {
  await Tone.start();

  startOverlay.style.display = 'none';
  
  markerDriver(marker0Element);
  drum1 = new MarkerDrum(marker1Element);
  drum2 = new MarkerDrum(marker2Element);
  synth1 = new MarkerSynth(marker3Element);
  synth2 = new MarkerSynth(marker4Element);
  pluck1 = new MarkerPluck(marker5Element);
  effect1 = new MarkerEffect(marker6Element);

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
  const driver = loopDriver(canvas, ctx);
  const instruments = [
    synth1.loop(canvas, ctx, driver),
    synth2.loop(canvas, ctx, driver),
    pluck1.loop(canvas, ctx, driver),
    drum1.loop(canvas, ctx, driver),
    drum2.loop(canvas, ctx, driver),
  ];
  effect1.loop(canvas, ctx, instruments),

  // Request another frame
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 1)
}
