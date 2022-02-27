import * as Tone from 'tone';
import videoSourceSelector from './video-source-selector';

videoSourceSelector();

const camera = document.querySelector('[camera]');
const marker = document.querySelector('a-marker');
let check;

let osc = new Tone.Oscillator(440, 'square').toDestination();

marker.addEventListener('markerFound', () => {
  let cameraPosition = camera.object3D.position;
  let markerPosition = marker.object3D.position;
  let distance = cameraPosition.distanceTo(markerPosition);

  osc.start();

  check = setInterval(() => {
    cameraPosition = camera.object3D.position;
    markerPosition = marker.object3D.position;

    osc.frequency.value =
      ((6.283 / 2 + marker.object3D.rotation.y) / 6.283) * 440 + 100;

    //console.log(marker.object3D.position)
    //console.log(marker.object3D.rotation)
  }, 100);
});

marker.addEventListener('markerLost', () => {
  clearInterval(check);
  osc.stop();
});
