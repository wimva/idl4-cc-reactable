// OSCILLATOR

import * as Tone from 'tone';
import { normalise } from './marker-helpers';

export default function (marker) {
  let check;

  let oscTypes = ['square', 'sine', 'triangle', 'sawtooth'];
  let osc = new Tone.Oscillator(440, oscTypes[0]).toDestination();

  marker.addEventListener('markerFound', () => {
    osc.start();
    check = setInterval(() => {
      osc.frequency.rampTo(normalise(marker.object3D.rotation.y) * 600);
      osc.type =
        oscTypes[
          Math.floor(normalise(marker.object3D.position.x) * oscTypes.length)
        ];
    }, 10);
  });

  marker.addEventListener('markerLost', () => {
    clearInterval(check);
    osc.stop();
  });
}
