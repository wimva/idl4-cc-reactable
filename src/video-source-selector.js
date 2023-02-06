import { videoSourceId } from './video-source-id';

let currentStream;

function stopMediaTracks(stream) {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

function gotDevices(mediaDevices) {
  console.log('available cameras:');
  mediaDevices.forEach((mediaDevice) => {
    if (mediaDevice.kind === 'videoinput') {
      console.log(mediaDevice);
    }
  });
}

export default function () {
  const videoElement = document.getElementById('arjs-video');

  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }

  let constraints = {
    video: {
      width: { min: 300, ideal: 800, max: 640 },
      height: { min: 200, ideal: 600, max: 480 },
      frameRate: { ideal: 6, max: 6 },
    },
    audio: false,
  };

  if (videoSourceId) {
    constraints.video = {
      deviceId: {
        exact: videoSourceId,
      },
    };
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      currentStream = stream;

      videoElement.srcObject = stream;
      var event = new CustomEvent('camera-init', {
        stream: stream,
      });
      window.dispatchEvent(event);
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch((error) => {
      console.error(error);
    });
}
