import videoSourceSelector from './video-source-selector';
import { notes, drumNotes } from './marker-helpers';
import markerDriver, {loopDriver} from './marker-driver';
import MarkerSound from './marker-sound';
import MarkerEffect from './marker-effect';
import * as Tone from 'tone';

let socketOpen = false;
const socket = new WebSocket("ws://192.168.100.2:1880");
socket.onopen = function(event) {
  socketOpen = true;
};

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

  drum1 = new MarkerSound(marker1Element, 'MembraneSynth', drumNotes);
  drum2 = new MarkerSound(marker2Element, 'MembraneSynth', drumNotes);
  drum3 = new MarkerSound(marker3Element, 'MembraneSynth', drumNotes);
  drum4 = new MarkerSound(marker4Element, 'MembraneSynth', drumNotes);
  drum5 = new MarkerSound(marker5Element, 'MembraneSynth', drumNotes);
  drum6 = new MarkerSound(marker6Element, 'MembraneSynth', drumNotes);
  synth1 = new MarkerSound(marker7Element, 'FMSynth', notes);
  synth2 = new MarkerSound(marker8Element, 'FMSynth', notes);
  synth3 = new MarkerSound(marker9Element, 'FMSynth', notes);
  synth4 = new MarkerSound(marker10Element, 'FMSynth', notes);
  synth5 = new MarkerSound(marker11Element, 'FMSynth', notes);
  pluck1 = new MarkerSound(marker12Element, 'PluckSynth', notes);
  pluck2 = new MarkerSound(marker13Element, 'PluckSynth', notes);
  pluck3 = new MarkerSound(marker14Element, 'PluckSynth', notes);
  pluck4 = new MarkerSound(marker15Element, 'PluckSynth', notes);

  effect1 = new MarkerEffect(marker16Element);
  effect2 = new MarkerEffect(marker17Element);
  effect3 = new MarkerEffect(marker18Element);

  startTime = performance.now();
  timedLoop();  
};

// draw loop
let ctx = canvas.getContext("2d");
function draw() {
  // Clear the canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw the correct markers
  const driver = loopDriver(canvas, ctx);
  const instruments = [
    synth1.loop(canvas, ctx, driver),
    synth2.loop(canvas, ctx, driver),
    synth3.loop(canvas, ctx, driver),
    synth4.loop(canvas, ctx, driver),
    synth5.loop(canvas, ctx, driver),
    pluck1.loop(canvas, ctx, driver),
    pluck2.loop(canvas, ctx, driver),
    pluck3.loop(canvas, ctx, driver),
    pluck4.loop(canvas, ctx, driver),
    drum1.loop(canvas, ctx, driver),
    drum2.loop(canvas, ctx, driver),
    drum3.loop(canvas, ctx, driver),
    drum4.loop(canvas, ctx, driver),
    drum5.loop(canvas, ctx, driver),
    drum6.loop(canvas, ctx, driver),
  ];
  effect1.loop(canvas, ctx, instruments);
  effect2.loop(canvas, ctx, instruments);
  effect3.loop(canvas, ctx, instruments);

  // send canvas via socket to driver for LED panels
  if (socketOpen) {
    socket.send(ctx.getImageData(0,0,canvas.width, canvas.height).data);
  }
}


let startTime;
function timedLoop() {
  // Get the current time
  const currentTime = performance.now();

  // Calculate the time elapsed since the last iteration
  const elapsedTime = currentTime - startTime;

  // Your code to be executed in the loop
  draw();

  // Calculate the timeout for the next iteration
  const timeout = Math.max(0, 50 - elapsedTime);

  // Set the start time for the next iteration
  startTime = performance.now();

  // Schedule the next iteration
  setTimeout(timedLoop, timeout);
}
