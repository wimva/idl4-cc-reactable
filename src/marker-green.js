// SYNTH

import * as Tone from 'tone';
import { normaliseRotation, notes } from './marker-helpers';

export default function (marker) {
  const synth = new Tone.PluckSynth().toDestination();

  let check;
  let currentNote = 0;

  marker.addEventListener('markerFound', () => {
    check = setInterval(() => {
      const newNote = Math.floor(
        normaliseRotation(marker.object3D.rotation.y) * notes.length,
      );
      if (newNote !== currentNote) {
        currentNote = newNote;
        synth.triggerAttack(notes[currentNote]);
      }
    }, 50);
  });

  marker.addEventListener('markerLost', () => {
    clearInterval(check);
  });
}
