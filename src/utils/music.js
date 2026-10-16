import { getContext, start, Time } from "tone";

export const playChord = (synth, notes = [], duration = '2n') => {
  start().then(() => {
    synth.triggerAttackRelease(notes, duration);
  })
  return new Promise((resolve) => {
    getContext().setTimeout(() => {
      resolve();
    }, Time(duration).toSeconds());
  });
}