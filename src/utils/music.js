import { getContext, start, loaded, Time, Sampler } from "tone";

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

export const getPianoSampler = () => {
  return new Sampler({
    urls: {
      C3: "assets/piano_C.wav",
    },
    baseUrl: "./",
  }).toDestination();
}

export const playChordSampler = async (sampler, notes = [], duration = '2n') => {
  loaded().then(() => {
    start().then(() => {
      sampler.triggerAttackRelease(notes, duration);
    })
  });
  return new Promise((resolve) => {
    getContext().setTimeout(() => {
      resolve();
    }, Time(duration).toSeconds());
  });
}
