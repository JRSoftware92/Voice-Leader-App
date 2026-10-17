import { getContext, start, loaded, now, Time, Sampler } from "tone";

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
      C4: "assets/piano_C.wav",
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

export const playNoteSampler = async (sampler, note, duration = '2n') => {
  loaded().then(() => {
    start().then(() => {
      sampler.triggerAttackRelease([note], duration);
    })
  });
  return new Promise((resolve) => {
    getContext().setTimeout(() => {
      resolve();
    }, Time(duration).toSeconds());
  });
}

export const playNotesSampler = async (sampler, notes, duration = '4n') => {
  loaded().then(() => {
    start().then(() => {
      const timeNow = now();
      notes.forEach((note, index) => sampler.triggerAttackRelease(note, duration, timeNow + (index * 0.5)))
    })
  });
  return new Promise((resolve) => {
    getContext().setTimeout(() => {
      resolve();
    }, Time(duration).toSeconds());
  });
}
