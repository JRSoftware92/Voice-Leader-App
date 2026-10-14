import React, { useCallback, useState } from 'react';

import intersection from "lodash/intersection";

import ScaleList from "../../components/scale-list/ScaleList.tsx";
import SelectScaleByNotes from "../../components/modals/SelectScaleByNotes/SelectScaleByNotes.tsx";
import ChordList from "../../components/chord-list/ChordList.tsx";
import {getChordInfoByName} from "../../voice-leading/identify-chords.js";

export const ScaleListTemplate = () => {
  const [scales, setScales] = useState([]);
  const [open, setOpen] = useState(false);

  const onScaleSelected = useCallback((scale) => {
    setScales([
      ...scales,
      scale
    ])
    setOpen(false);
  }, [scales])

  const chordSets = scales.map(({ chords }) => chords);
  const chordOverlap = intersection(...chordSets);
  const chords = chordOverlap?.length ? chordOverlap.map((name) => getChordInfoByName(name)) : [];

  return (
    <div className="flex flex-col items-center w-full">
      <ScaleList scales={scales} startNotes={[]} />
      <ChordList chords={chords}/>
      <SelectScaleByNotes onAccept={onScaleSelected} open={open} setOpen={setOpen} />
    </div>
  )
}

export default ScaleListTemplate;
