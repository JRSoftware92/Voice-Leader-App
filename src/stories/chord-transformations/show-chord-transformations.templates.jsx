import React, { useState } from 'react';
import { Chord } from "tonal";

import PianoKeyboard from '../../components/keyboard/PianoKeyboard.tsx';

import {
  identifyPossibleChords
} from "../../voice-leading/identify-chords";
import ChordList from "../../components/chord-list/ChordList.tsx";
import {generateAllVoicingTransformations} from "../../voice-leading/chord-transformations.js";
import ChordTransformationList from "../../components/common/ChordTransformationList/ChordTransformationList.tsx";

export const ChordTransformationsTemplate = () => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);

  const chordNames = identifyPossibleChords(notesArr);
  const chords = chordNames.map((name) => Chord.get(name));
  const chordZero = chords?.length ? chords[0] : null;
  const transforms = chordZero ? generateAllVoicingTransformations(0, notesArr, chordZero) : [];

  console.log('Transforms', transforms);

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
      <ChordTransformationList transformations={transforms} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />
    </div>
  )
}

export default ChordTransformationsTemplate;
