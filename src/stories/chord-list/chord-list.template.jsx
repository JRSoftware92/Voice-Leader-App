import React, { useState } from 'react';
import { Chord } from "tonal";

import PianoKeyboard from '../../components/keyboard/PianoKeyboard';

import {
  identifyPossibleChords
} from "../../voice-leading/identify-chords";
import ChordList from "../../components/chord-list/ChordList.tsx";

export const ChordListTemplate = () => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);

  const chordNames = identifyPossibleChords(notesArr);
  const chords = chordNames.map((name) => Chord.get(name));

  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      setNotes([...notesArr, id]);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <ChordList chords={chords} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />
    </div>
  )
}

export default ChordListTemplate;
