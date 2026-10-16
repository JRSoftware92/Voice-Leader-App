import React, { useState } from 'react';

import PianoKeyboard from '../../components/keyboard/PianoKeyboard.tsx';

import {
  generateAllHalfStepContraryMovements,
  generateAllHalfStepParallelMovements,
  generateAllVoicingTransformations
} from "../../voice-leading/chord-transformations.js";
import ChordTransformationList from "../../components/ChordTransformationList/ChordTransformationList.tsx";
import SelectChordByNotes from "../../components/modals/SelectChordByNotes/SelectChordByNotes.tsx";
import {generateRootlessTransformations, generateSingleNoteTransformations} from "../../utils/transformation-utils.ts";

// Keyboard and root key specification on bottom
// List panels on top:
// Bass Swaps (Rootless Voicings),
// Nearby Chords (Valid Voice Leading Transforms),
// Leading Dominants and Target dominants (resolved from [V to I], or moving to [ii to V]) (either a fifth or a fourth away)

// extended into tritone territory: bII7 – I or ii – bII7 (always a half step away)
// extended to backdoor dominants: bVII7 - I or iv7 - bVII7 (either a step or a perfect fourth away)
// Show relative scale degrees of chords to the original source key/chord

// For bass swaps - prioritize in order: (Half step and step, third and minor third, fifth and fourth)
// For nearby chords - stick to half step and stepwise transformations at the top, then branch out further down the list
//  - Favor thirds, fourths, fifths as per the bass swap ordering


// TODO - Fix Notes List and Arrays => Showing Duplicate notes OR notes in wrong order
export const ChordTransformationsTemplate = () => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);
  const [selectedChord, setChord] = useState(null);
  const [open, setOpen] = useState(false);

  // const transforms = selectedChord ? generateAllVoicingTransformations(0, notesArr, selectedChord) : [];
  const rootless = selectedChord ? generateRootlessTransformations(selectedChord, notesArr) : [];
  const oblique = selectedChord ? generateSingleNoteTransformations(selectedChord, notesArr) : [];
  const halfStepParallel = selectedChord ? generateAllHalfStepParallelMovements(notesArr, selectedChord) : [];
  const halfStepContrary = selectedChord ? generateAllHalfStepContraryMovements(notesArr, selectedChord) : [];
  const transforms = [...rootless, ...oblique, ...halfStepParallel, ...halfStepContrary];

  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      setNotes([...notesArr, id]);
    }
  }

  const onAccept = (chord) => {
    setChord(chord);
    setOpen(false);
  }

  return (
    <div className="flex flex-col items-center w-full">
      <SelectChordByNotes notes={notesArr} open={open} setOpen={setOpen} onAccept={onAccept} />
      <ChordTransformationList transformations={transforms} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} hideLabels />
    </div>
  )
}

export default ChordTransformationsTemplate;
