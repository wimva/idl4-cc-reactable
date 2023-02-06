import * as Tone from 'tone';
import { normalisePosition, normaliseRotation, notes } from './marker-helpers';

export default class {
  marker = null;
  markerIsAdded = false;
  hit = false;
  currentNote = 0;

  constructor(marker) {
    this.reverb = new Tone.JCReverb(0.5).toDestination();
    this.delay = new Tone.FeedbackDelay(0.4);
    this.distortion = new Tone.Distortion(0.8);
    this.synth = new Tone.PluckSynth().chain(this.distortion, this.reverb, this.delay);

    this.marker = marker;
    if (marker && marker.object3D && marker.object3D.position && marker.object3D.position.x) {
      this.markerIsAdded = true;
    }
    this.marker.addEventListener('markerFound', () => {
      this.markerIsAdded = true;
    });

    this.marker.addEventListener('markerLost', () => {
      this.markerIsAdded = false;
    });
  }

  loop(canvas, ctx, driver) {
    if (this.markerIsAdded) {

      // define
      let markerX = normalisePosition(this.marker.object3D.position.x)*canvas.width;
      let markerY = normalisePosition(this.marker.object3D.position.y)*canvas.height;
      let rotation = normaliseRotation(this.marker.object3D.rotation.y);

      // draw the rotation
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.arc(markerX, markerY, canvas.width/30, -Math.PI/2, -Math.PI/2 + 2 * Math.PI * rotation);
      ctx.stroke();

      // compare with drivermaker
      if (driver) {
        // play sound
        const distance = Math.sqrt(Math.pow(markerX - driver.x, 2) + Math.pow(markerY - driver.y, 2));
        
        if (distance < canvas.width / 2) {
          const angle = Math.atan2(markerY - driver.y, markerX - driver.x);

          if (driver.r >= angle - 0.2 && driver.r <= angle + 0.2) {
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
          ctx.lineTo(driver.x, driver.y);
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
        reverb: this.reverb,
        distortion: this.distortion,
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