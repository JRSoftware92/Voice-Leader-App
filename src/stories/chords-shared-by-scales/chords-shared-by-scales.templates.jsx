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

  const chordSets = scales.map((scale) => scale?.chords ? scale.chords : []);
  const chordOverlap = intersection(...chordSets);
  // const chords = chordOverlap?.length ? chordOverlap.map((name) => getChordInfoByName(name)) : [];

  const chords = [
    {
      "empty": false,
      "name": "C major seventh",
      "setNum": 2193,
      "chroma": "100010010001",
      "normalized": "100010010001",
      "intervals": [
        "1P",
        "3M",
        "5P",
        "7M"
      ],
      "quality": "Major",
      "aliases": [
        "maj7",
        "Δ",
        "ma7",
        "M7",
        "Maj7",
        "^7"
      ],
      "symbol": "Cmaj7",
      "tonic": "C",
      "type": "major seventh",
      "root": "",
      "bass": "",
      "rootDegree": null,
      "notes": [
        "C",
        "E",
        "G",
        "B"
      ],
      "qualitySymbol": "maj7"
    },
    {
      "empty": false,
      "name": "E minor seventh",
      "setNum": 2322,
      "chroma": "100100010010",
      "normalized": "100010010100",
      "intervals": [
        "1P",
        "3m",
        "5P",
        "7m"
      ],
      "quality": "Minor",
      "aliases": [
        "m7",
        "min7",
        "mi7",
        "-7"
      ],
      "symbol": "Em7",
      "tonic": "E",
      "type": "minor seventh",
      "root": "",
      "bass": "",
      "rootDegree": null,
      "notes": [
        "E",
        "G",
        "B",
        "D"
      ],
      "qualitySymbol": "m7"
    },
    {
      "empty": false,
      "name": "Ab minor seventh",
      "setNum": 2322,
      "chroma": "100100010010",
      "normalized": "100010010100",
      "intervals": [
        "1P",
        "3m",
        "5P",
        "7m"
      ],
      "quality": "Minor",
      "aliases": [
        "m7",
        "min7",
        "mi7",
        "-7"
      ],
      "symbol": "Abm7",
      "tonic": "Ab",
      "type": "minor seventh",
      "root": "",
      "bass": "",
      "rootDegree": null,
      "notes": [
        "Ab",
        "B",
        "Eb",
        "Gb"
      ],
      "qualitySymbol": "m7"
    }
  ]

  return (
    <div className="flex flex-col items-center w-full">
      <ScaleList scales={scales} startNotes={[]} />
      <ChordList chords={chords} scale={scales[0]}/>
      <SelectScaleByNotes notes={notesArr} onAccept={onScaleSelected} open={open} setOpen={setOpen} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />
    </div>
  )
}

export default ScaleListTemplate;
