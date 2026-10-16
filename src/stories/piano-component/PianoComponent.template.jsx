import React, { useState } from 'react';
import { Note } from "tonal";

import PianoKeyboard from '../../components/keyboard/PianoKeyboard.tsx';

import {
  getIntervallicPatternOfNotes,
  getScaleDegreePatternOfChord,
  identifyPossibleChords
} from "../../voice-leading/identify-chords";
import {playChord} from "../../utils/music.js";

export const IdentifyChordsByNotes = ({ width, height, readonly, hideLabels, numberOfOctaves }) => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);

  const chords = identifyPossibleChords(notesArr);

  const distances = notesArr ? getScaleDegreePatternOfChord(notesArr) : null;
  const distanceStr = distances ? distances.join(', ') : '';

  const intervalPattern = notesArr ? getIntervallicPatternOfNotes(notesArr) : [];
  const intervalStr = intervalPattern?.length ? intervalPattern.join(', ') : '';

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
      <span>{chords.join(', ')}</span>
      <span>{distanceStr}</span>
      <span>{intervalStr}</span>
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

export default IdentifyChordsByNotes;
