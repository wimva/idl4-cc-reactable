export function normalise(input) {
  let output = Math.abs((Math.PI + input) / (Math.PI * 2));
  if (output < 0) output = 0;
  if (output > 0.999999999) output = 0.999999999;
  return output;
}

export const notes = [
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

export class loopstation {
  loopList = [];
  loopLength = 8;
  loopIndex = 0;
  loopTempo = 2;
  loopTempos = [80, 160, 320];

  synth = null;
  synthNoteLentgh = '32n';

  constructor(synth, synthNoteLentgh) {
    this.synth = new synth().toDestination();
    if (synthNoteLentgh) this.synthNoteLentgh = synthNoteLentgh;
    setTimeout(() => {
      this.loop();
    }, this.loopTempos[this.loopTempo]);
  }

  loop() {
    // control loop
    this.loopIndex++;
    if (this.loopIndex >= this.loopLength) {
      this.loopIndex = 0;
    }

    // add notes
    const newNote = this.getNewNote();
    if (newNote != false) {
      this.loopList[this.loopIndex] = newNote;
    }

    // adjust tempo
    this.setTempo();

    // play notes
    if (this.loopList[this.loopIndex]) {
      this.synth.triggerAttackRelease(
        notes[this.loopList[this.loopIndex]],
        this.synthNoteLentgh,
      );
    }

    // repeat loop
    setTimeout(() => {
      this.loop();
    }, this.loopTempos[this.loopTempo]);
  }
}
