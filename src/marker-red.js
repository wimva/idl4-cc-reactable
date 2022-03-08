// NOISE;

import * as Tone from 'tone';
import { normalise } from './marker-helpers';

export default function (marker) {
  let check;

  const noise = new Tone.Noise('white');
  const autoFilter = new Tone.AutoFilter({
    frequency: '8n',
    baseFrequency: 200,
    octaves: 8,
  }).toDestination();
  noise.connect(autoFilter);

  marker.addEventListener('markerFound', () => {
    noise.start();
    autoFilter.start();
    check = setInterval(() => {
      autoFilter.frequency.rampTo(
        normalise(marker.object3D.position.x) * 8 + 'n',
      );
      autoFilter.octaves = normalise(marker.object3D.rotation.y) * 8;
    }, 10);
  });

  marker.addEventListener('markerLost', () => {
    clearInterval(check);
    noise.stop();
    autoFilter.stop();
  });
}
