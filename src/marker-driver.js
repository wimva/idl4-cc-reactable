import { normalisePosition, normaliseRotation } from './marker-helpers';

let angle = 0; // starting angle in radians
let markerIsAdded = false;
let marker = null;

export function loopDriver(canvas, ctx) {
  if (markerIsAdded) {
    // define
    let markerX = normalisePosition(marker.object3D.position.x)*canvas.width;
    let markerY = (1-normalisePosition(marker.object3D.position.y))*canvas.height;
    let rotation = normaliseRotation(marker.object3D.rotation.y);
    let speed = (rotation)*0.2+0.05;

    let radius = canvas.width; // radius of the radar line
    
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(markerX,markerY);
    let x = markerX + radius * Math.cos(angle);
    let y = markerY + radius * Math.sin(angle);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Update the start angle
    angle += speed;
    if (angle > Math.PI) angle = -Math.PI;

    // draw the rotation speed
    ctx.beginPath();
    ctx.arc(markerX, markerY, 20, -Math.PI/2, -Math.PI/2 + 2 * Math.PI * rotation);
    ctx.stroke();

    return {
      x: markerX,
      y: markerY,
      r: angle
    }
  }

  return null;
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