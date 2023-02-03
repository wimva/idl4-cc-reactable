import * as Tone from 'tone';
import { normalisePosition, normaliseRotation, notes } from './marker-helpers';

export default class {
  marker = null;
  markerIsAdded = false;
  hit = false;
  currentNote = 0;

  constructor(marker) {
    this.marker = marker;
    this.marker.addEventListener('markerFound', () => {
      this.markerIsAdded = true;
    });

    this.marker.addEventListener('markerLost', () => {
      this.markerIsAdded = false;
    });
  }

  loop(canvas, ctx, instruments) {
    if (this.markerIsAdded) {

      // define
      let markerX = normalisePosition(this.marker.object3D.position.x)*canvas.width;
      let markerY = normalisePosition(this.marker.object3D.position.y)*canvas.height;
      let rotation = normaliseRotation(this.marker.object3D.rotation.y);

      // draw the rotation
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(markerX, markerY, 20, -Math.PI/2, -Math.PI/2 + 2 * Math.PI * rotation);
      ctx.stroke();

      // find closest marker
      let shortestDistance = null;
      let closestMarker = null;

      instruments.forEach(instrument => {
        if (instrument) {
          const distance = Math.sqrt(Math.pow(markerX - instrument.x, 2) + Math.pow(markerY - instrument.y, 2));
          if (shortestDistance == null || distance < shortestDistance) {
            shortestDistance = distance;
            closestMarker = instrument;
          }
        }
      });

      if (closestMarker) {
        // draw the connection
        ctx.beginPath();
        ctx.moveTo(markerX, markerY);
        ctx.lineTo(closestMarker.x, closestMarker.y);
        ctx.stroke();

        // effect
        closestMarker.reverb.roomSize.value = rotation * 0.5 + 0.5;
        closestMarker.distortion.distortion = shortestDistance/400 > 1 ? 1 : shortestDistance/400;
      }
    
      return {
        x: markerX,
        y: markerY,
      }
    }

    return null;
  }
}