import * as Tone from 'tone';
import { normalisePosition, normaliseRotation, notes } from './marker-helpers';

let angle = 0; // starting angle in radians
let markerIsAdded = false;
let marker = null;
let hit = false;
let currentNote = 0;

const dist = new Tone.Distortion(0.8).toDestination();
const synth = new Tone.FMSynth().connect(dist);

export function loopSynth(canvas, ctx, driverMarker) {
  if (markerIsAdded) {

    // define
    let markerX = normalisePosition(marker.object3D.position.x)*canvas.width;
    let markerY = (1-normalisePosition(marker.object3D.position.y))*canvas.height;
    let rotation = normaliseRotation(marker.object3D.rotation.y);

    // draw the rotation
    ctx.beginPath();
    ctx.arc(markerX, markerY, 20, -Math.PI/2, -Math.PI/2 + 2 * Math.PI * rotation);
    ctx.stroke();

    // compare with drivermaker
    if (driverMarker) {
      // play sound
      const distance = Math.sqrt(Math.pow(markerX - driverMarker.x, 2) + Math.pow(markerY - driverMarker.y, 2));
      // TODO distance could change type of synth or...?
      const angle = Math.atan2(markerY - driverMarker.y, markerX - driverMarker.x);

      if (driverMarker.r >= angle - 0.2 && driverMarker.r <= angle + 0.2) {
        if (hit == false) {
          hit = true;
          const now = Tone.now()
          const note = Math.floor(rotation * notes.length);
          synth.triggerAttack(notes[note], now);
          synth.triggerRelease(now + distance/1000);
        }
      } else {
        hit = false;
      }

      // draw the connection
      ctx.beginPath();
      ctx.moveTo(markerX, markerY);
      ctx.lineTo(driverMarker.x, driverMarker.y);
      ctx.stroke();
    } else {

      // standalone
      const note = Math.floor(rotation * notes.length);
      if (note != currentNote) {
        currentNote = note;
        synth.triggerAttack(notes[note]);
      }
    }
  }
}

export default function (givenMarker) {
  marker = givenMarker;
  marker.addEventListener('markerFound', () => {
    markerIsAdded = true;
  });

  marker.addEventListener('markerLost', () => {
    markerIsAdded = false;
  });
}