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
const marker7Element = document.querySelector('#marker-7');
const marker8Element = document.querySelector('#marker-8');
const marker9Element = document.querySelector('#marker-9');
const marker10Element = document.querySelector('#marker-10');
const marker11Element = document.querySelector('#marker-11');
const marker12Element = document.querySelector('#marker-12');
const marker13Element = document.querySelector('#marker-13');
const marker14Element = document.querySelector('#marker-14');
const marker15Element = document.querySelector('#marker-15');
const marker16Element = document.querySelector('#marker-16');
const marker17Element = document.querySelector('#marker-17');
const marker18Element = document.querySelector('#marker-18');

const canvas = document.querySelector("#drawboard");

const startButton = document.querySelector('#start-button');
const startOverlay = document.querySelector('#start-overlay');

let synth1 = null;
let synth2 = null;
let synth3 = null;
let synth4 = null;
let synth5 = null;
let drum1 = null;
let drum2 = null;
let drum3 = null;
let drum4 = null;
let drum5 = null;
let drum6 = null;
let pluck1 = null;
let pluck2 = null;
let pluck3 = null;
let pluck4 = null;
let effect1 = null;
let effect2 = null;
let effect3 = null;

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
  drum3 = new MarkerDrum(marker3Element);
  drum4 = new MarkerDrum(marker4Element);
  drum5 = new MarkerDrum(marker5Element);
  drum6 = new MarkerDrum(marker6Element);
  synth1 = new MarkerSynth(marker7Element);
  synth2 = new MarkerSynth(marker8Element);
  synth3 = new MarkerPluck(marker9Element);
  synth4 = new MarkerEffect(marker10Element);
  synth5 = new MarkerEffect(marker11Element);
  pluck1 = new MarkerEffect(marker12Element);
  pluck2 = new MarkerEffect(marker13Element);
  pluck3 = new MarkerEffect(marker14Element);
  pluck4 = new MarkerEffect(marker15Element);
  effect1 = new MarkerEffect(marker16Element);
  effect2 = new MarkerEffect(marker17Element);
  effect3 = new MarkerEffect(marker18Element);

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
    synth3.loop(canvas, ctx, driver),
    synth4.loop(canvas, ctx, driver),
    synth5.loop(canvas, ctx, driver),
    pluck1.loop(canvas, ctx, driver),
    pluck3.loop(canvas, ctx, driver),
    pluck3.loop(canvas, ctx, driver),
    pluck4.loop(canvas, ctx, driver),
    drum1.loop(canvas, ctx, driver),
    drum2.loop(canvas, ctx, driver),
    drum3.loop(canvas, ctx, driver),
    drum4.loop(canvas, ctx, driver),
    drum5.loop(canvas, ctx, driver),
    drum6.loop(canvas, ctx, driver),
  ];
  effect1.loop(canvas, ctx, instruments),
  effect2.loop(canvas, ctx, instruments),
  effect3.loop(canvas, ctx, instruments),

  // Request another frame
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 1)
}
