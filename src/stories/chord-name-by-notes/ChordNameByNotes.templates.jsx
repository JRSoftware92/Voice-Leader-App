import React, { useState } from 'react';
import { Note } from "tonal";

import PianoKeyboard from '../../components/keyboard/PianoKeyboard.tsx';

import {
  getIntervallicPatternOfNotes,
  getScaleDegreePatternOfChord,
  identifyPossibleChords
} from "../../voice-leading/identify-chords";
import {playChord} from "../../utils/music.js";
import {deriveChordNameFromNotes, getPossibleNamesOfChordByNotes} from "../../voice-leading/chord-derivation.js";

export const ChordNameByNotes = ({ width, height, readonly, hideLabels, numberOfOctaves }) => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);

  // FIXME - Feels too loose with type assignments - need strictly branching cases that are easy to predict
  // Simplify rules by tonal role (third, fifth, seventh, extensions, augmentations / alterations)
  // Third = major, minor, sus2, or sus4
  // Fifth = Normal Triad, Augmented Triad, Diminished Triad
  // Seventh = Major Seventh, Minor Seventh, Sixth*
  // From here you get: maj, min, maj6, min6, maj7, min7, sus2, sus4, aug, aug7, dim, dim7, m7b5, dom7

  // Extensions = 9, 11, 13 = (2, 4, 6)
  // 9, 11, 13 - relies on the presence of a 7th - otherwise, they're augmentations. Sixth doesn't count here
  // maj7, min7, and dom7 get a different label when extensions are present (maj9, min11, dom13, etc.)
  //
  // Alterations = b9 (b2), #9 (b3), #11 (b5), b13 (#5) - these are appended
  // Augmentations = Everything else (add2, add9, etc.) - these are appended

  // Name Formula: Type + Extension + Alteration & Augmentations

  // Separate logic for third, fifth, and seventh from extensions, alterations, and augmentations
  // These can be done in stages, sort of, but 3 5 and 7 determine the most important parts of the chord
  const possibleNames = getPossibleNamesOfChordByNotes(notesArr);
  const chordName = possibleNames.length > 0 ? possibleNames[0] : '';

  console.groupCollapsed('Chord Names');
  console.log('Notes', notesArr);
  console.log('Names', possibleNames);
  console.groupEnd();

  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      const newNotes = [...notesArr, id];
      const sortedNotes = newNotes.sort((a, b) => Note.midi(a) - Note.midi(b));
      setNotes(sortedNotes);
    }
  }

  const onPlayChord = () => playChord(notesArr);

  return (
    <div className="flex flex-col items-center w-full">
      <span>{chordName}</span>
      <button onClick={onPlayChord}>play</button>
      <PianoKeyboard
        onKeyToggle={onKeyToggle}
        selectedKeys={notesArr}
        keyboardWidth={width}
        keyHeight={height}
        readonly={readonly}
        hideLabels={hideLabels}
        numberOfOctaves={numberOfOctaves}
      />
    </div>
  )
}

export default ChordNameByNotes;
