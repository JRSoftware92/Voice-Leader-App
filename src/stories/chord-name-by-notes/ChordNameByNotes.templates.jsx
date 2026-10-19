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

  const chordName = notesArr.length > 2 ? deriveChordNameFromNotes(notesArr, notesArr[0]) : '';
  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      const newNotes = [...notesArr, id];
      const sortedNotes = newNotes.sort((a, b) => Note.midi(a) - Note.midi(b));
      setNotes(sortedNotes);
    }
  }

  console.log('All Names', getPossibleNamesOfChordByNotes(notesArr))

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
