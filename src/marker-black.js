// LOOPSTATION

import * as Tone from 'tone';
import { normalisePosition, normaliseRotation, notes, loopstation } from './marker-helpers';

export default function (marker) {
  let currentNote = null;
  let markerIsAdded = false;

  const loop = new loopstation(Tone.MembraneSynth, 0.05);

  loop.getNewNote = () => {
    if (markerIsAdded) {
      const newNote = Math.floor(
        normaliseRotation(marker.object3D.rotation.y) * notes.length,
      );
      if (newNote !== currentNote) {
        currentNote = newNote;
        return currentNote;
      } else {
        return null;
      }
    }

    return false;
  };

  loop.setTempo = () => {
    if (markerIsAdded) {
      loop.loopTempo = Math.floor(
        normalisePosition(marker.object3D.position.x) * loop.loopTempos.length,
      );
    }
  };

  marker.addEventListener('markerFound', () => {
    markerIsAdded = true;
  });

  marker.addEventListener('markerLost', () => {
    markerIsAdded = false;
  });
}
