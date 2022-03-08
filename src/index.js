import videoSourceSelector from './video-source-selector';
import markerYellow from './marker-yellow';
import markerRed from './marker-red';
import markerGreen from './marker-green';
import * as Tone from 'tone';

const camera = document.querySelector('[camera]');

const markerGreenElement = document.querySelector('#marker-green');
const markerYellowElement = document.querySelector('#marker-yellow');
const markerRedElement = document.querySelector('#marker-red');
const markerBlueElement = document.querySelector('#marker-blue');

const startButton = document.querySelector('#start-button');
const startOverlay = document.querySelector('#start-overlay');

window.addEventListener('arjs-video-loaded', () => {
  startButton.style.display = 'block';

  videoSourceSelector();
});

startButton.onclick = async () => {
  await Tone.start();

  startOverlay.style.display = 'none';

  markerYellow(markerYellowElement);
  markerRed(markerRedElement);
  markerGreen(markerGreenElement);
};
