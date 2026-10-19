import React, { useState } from 'react';

import uniqBy from 'lodash/uniqBy';

import PianoKeyboard from '../../components/keyboard/PianoKeyboard.tsx';

import {
  getScaleNamesByNotes,
  getScaleInfoByName,
} from "../../voice-leading/identify-scales.js";
import ScaleList from "../../components/scale-list/ScaleList.tsx";
import {getPianoSampler, playNotesSampler} from "../../utils/music.js";

export const ScaleListTemplate = () => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);
  const sampler = getPianoSampler();

  const scaleNames = getScaleNamesByNotes(notesArr);
  const scales = scaleNames.map((name) => getScaleInfoByName(name));
  const deduplicatedScales = uniqBy(scales, (scale) => scale.name);


  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      setNotes([...notesArr, id]);
    }
  }

  const onScaleClick = (scale) => {
    playNotesSampler(sampler, scale.notes);
  }

  return (
    <div className="flex flex-col items-center w-full">
      <ScaleList scales={deduplicatedScales} startNotes={notesArr} onClick={onScaleClick} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />
    </div>
  )
}

export default ScaleListTemplate;
