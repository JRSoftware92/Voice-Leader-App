import { PolySynth, start } from "tone";

export const playChord = async (notes = [], duration = '2n') => {
  const synth = new PolySynth().toDestination();

  await start();

  synth.triggerAttackRelease(notes, duration);
}