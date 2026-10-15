import React, { useCallback, useState } from 'react';

import intersection from "lodash/intersection";

import ScaleList from "../../components/scale-list/ScaleList.tsx";
import SelectScaleByNotes from "../../components/modals/SelectScaleByNotes/SelectScaleByNotes.tsx";
import ChordList from "../../components/chord-list/ChordList.tsx";
import {getChordInfoByName} from "../../voice-leading/identify-chords.js";
import PianoKeyboard from "../../components/keyboard/PianoKeyboard.tsx";

export const ScaleListTemplate = () => {
  const [scales, setScales] = useState([]);
  const [open, setOpen] = useState(false);
  const [notesArr, setNotes] = useState([]);

  const onScaleSelected = useCallback((scale) => {
    setScales([
      ...scales,
      scale
    ])
    setOpen(false);
  }, [scales])

  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      setNotes([...notesArr, id]);
    }
  }

  const chordSets = scales.map(({ chords }) => chords);
  const chordOverlap = intersection(...chordSets);
  const chords = chordOverlap?.length ? chordOverlap.map((name) => getChordInfoByName(name)) : [];

  return (
    <div className="flex flex-col items-center w-full">
      <ScaleList scales={scales} startNotes={[]} />
      <ChordList chords={chords}/>
      <SelectScaleByNotes notes={notesArr} onAccept={onScaleSelected} open={open} setOpen={setOpen} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />
    </div>
  )
}

export default ScaleListTemplate;
