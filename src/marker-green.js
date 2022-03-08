// SYNTH

import * as Tone from 'tone';
import { normalise } from './marker-helpers';

export default function (marker) {
  const notes = [
    'A1',
    'B1',
    'C1',
    'D1',
    'E1',
    'F1',
    'G1',
    'A2',
    'B2',
    'C2',
    'D2',
    'E2',
    'F2',
    'G2',
    'A3',
    'B3',
    'C3',
    'D3',
    'E3',
    'F3',
    'G3',
    'A4',
    'B4',
    'C4',
    'D4',
    'E4',
    'F4',
    'G4',
    'A5',
    'B5',
    'C5',
    'D5',
    'E5',
    'F5',
    'G5',
  ];

  const plucky = new Tone.PluckSynth().toDestination();

  let check;
  let currentNote = 0;

  marker.addEventListener('markerFound', () => {
    check = setInterval(() => {
      const newNote = Math.floor(
        normalise(marker.object3D.rotation.y) * notes.length,
      );
      if (newNote !== currentNote) {
        currentNote = newNote;
        plucky.triggerAttack(notes[currentNote]);
      }
    });
  });

  marker.addEventListener('markerLost', () => {
    clearInterval(check);
  });
}
