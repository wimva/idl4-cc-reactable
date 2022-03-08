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
