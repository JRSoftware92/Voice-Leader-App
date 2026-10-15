import React, { useState } from 'react';

import PianoKeyboard from '../../components/keyboard/PianoKeyboard.tsx';

import {
  getScaleNamesByNotes,
  getScaleInfoByName,
  getScaleChordsByNotes,
} from "../../voice-leading/identify-scales.js";
import ScaleList from "../../components/scale-list/ScaleList.tsx";

export const ScaleListTemplate = () => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);

  const scaleNames = getScaleNamesByNotes(notesArr);
  const scales = scaleNames.map((name) => getScaleInfoByName(name));
  const scalesWithChords = scales.map((scale) => ({
    ...scale,
    chords: getScaleChordsByNotes(scale.notes, true),
  }))

  console.log(scalesWithChords);

  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      setNotes([...notesArr, id]);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <ScaleList scales={scales} startNotes={notesArr} onClick={(scale) => console.log('Clicked', scale)} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />
    </div>
  )
}

export default ScaleListTemplate;
