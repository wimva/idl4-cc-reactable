// LOOPSTATION

import * as Tone from 'tone';
import { normalise, notes } from './marker-helpers';

export default function (marker) {
  const loopstation = [];
  const loopstationLength = 8;
  const loopstationTempo = 150;
  let loopstationCurrent = 0;
  let currentNote = null;
  let markerIsAdded = false;

  const synth = new Tone.AMSynth().toDestination();

  let looper = setInterval(() => {
    loopstationCurrent++;
    if (loopstationCurrent >= loopstationLength) {
      loopstationCurrent = 0;
    }

    // add notes
    if (markerIsAdded) {
      const newNote = Math.floor(
        normalise(marker.object3D.rotation.y) * notes.length,
      );
      if (newNote !== currentNote) {
        currentNote = newNote;
        loopstation[loopstationCurrent] = currentNote;
      } else {
        loopstation[loopstationCurrent] = null;
      }
    }

    // play notes
    if (loopstation[loopstationCurrent]) {
      synth.triggerAttackRelease(notes[loopstation[loopstationCurrent]], '32n');
    }
  }, loopstationTempo);

  marker.addEventListener('markerFound', () => {
    markerIsAdded = true;
  });

  marker.addEventListener('markerLost', () => {
    markerIsAdded = false;
  });
}
