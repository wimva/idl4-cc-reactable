import * as Tone from 'tone';
import { normalisePosition, normaliseRotation, notes } from './marker-helpers';

// const synth = new Tone.MembraneSynth().connect(dist);

// TODO: when distance is too long, separate and use without driver
// TODO: add drums with white noise
// TODO: add reverb to closest node
// TODO: add continues sound with soort of waves

export default class {
  marker = null;
  markerIsAdded = false;
  hit = false;
  currentNote = 0;
  dist = null;
  synth = null;

  constructor(marker) {
    this.dist = new Tone.Distortion(0.8).toDestination();
    this.synth = new Tone.FMSynth().connect(this.dist);

    this.marker = marker;
    this.marker.addEventListener('markerFound', () => {
      this.markerIsAdded = true;
    });

    this.marker.addEventListener('markerLost', () => {
      this.markerIsAdded = false;
    });
  }

  loopSynth(canvas, ctx, driverMarker) {
    if (this.markerIsAdded) {

      // define
      let markerX = normalisePosition(this.marker.object3D.position.x)*canvas.width;
      let markerY = (1-normalisePosition(this.marker.object3D.position.y))*canvas.height;
      let rotation = normaliseRotation(this.marker.object3D.rotation.y);

      // draw the rotation
      ctx.beginPath();
      ctx.arc(markerX, markerY, 20, -Math.PI/2, -Math.PI/2 + 2 * Math.PI * rotation);
      ctx.stroke();

      // compare with drivermaker
      if (driverMarker) {
        // play sound
        const distance = Math.sqrt(Math.pow(markerX - driverMarker.x, 2) + Math.pow(markerY - driverMarker.y, 2));
        
        if (distance < 500) {
          const angle = Math.atan2(markerY - driverMarker.y, markerX - driverMarker.x);

          if (driverMarker.r >= angle - 0.2 && driverMarker.r <= angle + 0.2) {
            if (this.hit == false) {
              this.hit = true;
              const now = Tone.now()
              const note = Math.floor(rotation * notes.length);
              this.synth.triggerAttack(notes[note], now);
              this.synth.triggerRelease(now + distance/1000);
            }
          } else {
            this.hit = false;
          }

          // draw the connection
          ctx.beginPath();
          ctx.moveTo(markerX, markerY);
          ctx.lineTo(driverMarker.x, driverMarker.y);
          ctx.stroke();
        } else {
          this.playContinousNote(rotation);
        }
      } else {
        this.playContinousNote(rotation);
      }

      return {
        x: markerX,
        y: markerY,
      }
    }

    return null;
  }

  playContinousNote(rotation) {
    const note = Math.floor(rotation * notes.length);
    if (note != this.currentNote) {
      this.currentNote = note;
      this.synth.triggerAttack(notes[note]);
    }
  }
}