import React, { useState } from 'react';

import PianoKeyboard from '../../components/keyboard/PianoKeyboard';

import {
  getIntervallicPatternOfNotes,
  getScaleDegreePatternOfChord,
  identifyPossibleChords
} from "../../voice-leading/identify-chords";

export const IdentifyChordsByNotes = () => {
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
      setNotes([...notesArr, id]);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <span>{chords.join(', ')}</span>
      <span>{distanceStr}</span>
      <span>{intervalStr}</span>
      <PianoKeyboard onKeyToggle={onKeyToggle} selectedKeys={notesArr} />
    </div>
  )
}

export default IdentifyChordsByNotes;
