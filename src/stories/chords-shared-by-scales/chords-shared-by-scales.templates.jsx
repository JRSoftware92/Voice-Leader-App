import React, { useCallback, useState } from 'react';

import {Interval, Note, transpose} from "tonal";

import uniqBy from "lodash/uniqBy";

import ScaleList from "../../components/scale-list/ScaleList.tsx";
import SelectScaleByNotes from "../../components/modals/SelectScaleByNotes/SelectScaleByNotes.tsx";
import ChordList from "../../components/chord-list/ChordList.tsx";
import {getChordInfoByName} from "../../voice-leading/identify-chords.js";
import PianoKeyboard from "../../components/keyboard/PianoKeyboard.tsx";
import {getPianoSampler, playChordSampler} from "../../utils/music.js";
import {getScaleChordsByNotes} from "../../voice-leading/identify-scales.js";

export const ScaleListTemplate = ({ useSevenths = false }) => {
  const [scales, setScales] = useState([]);
  const [selectedScale, setSelectedScale] = useState(null);
  const [open, setOpen] = useState(false);
  const [notesArr, setNotes] = useState([]);

  const sampler = getPianoSampler();

  const onChordClicked = (chord) => {
    const notes = chord.intervals.map(interval => transpose(`${chord.tonic}3`, interval));
    playChordSampler(sampler, notes);
  }

  const onScaleSelected = useCallback((scale) => {
    setScales([
      ...scales,
      {
        ...scale,
        chords: getScaleChordsByNotes(scale.notes, useSevenths),
      }
    ])
    setOpen(false);
  }, [scales])

  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      const newArr = [...notesArr, id];
      const sortedNotes = newArr.sort((a, b) => {
        return Note.midi(a) - Note.midi(b);
      });
      setNotes(sortedNotes);
    }
  }

  const allChords = scales.flatMap((scale) => scale.chords);
  const filteredChords = allChords.filter((chord) => {
    const chordNotes = chord.notes;
    return chordNotes.every((note) => scales.every((scale) => scale.notes.includes(note)));
  });
  const chords = uniqBy(filteredChords, (chord) => chord.name);

  const handleScaleClick = (scale) => {
    if (selectedScale?.name !== scale.name) {
      setSelectedScale(scale);
    } else {
      setSelectedScale(null);
    }
  }

  const handleScaleDelete = (scale) => {
    if (selectedScale?.name === scale.name) {
      setSelectedScale(null);
    }
    setScales(scales.filter(({ name }) => name !== scale.name))
  }

  return (
    <div className="flex flex-col items-center w-full">
      <ScaleList scales={scales} selectedScaleName={selectedScale?.name} onClick={handleScaleClick} onDelete={handleScaleDelete}/>
      <ChordList chords={chords} scale={selectedScale} onClick={onChordClicked}/>
      <SelectScaleByNotes notes={notesArr} onAccept={onScaleSelected} open={open} setOpen={setOpen} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} hideLabels />
    </div>
  )
}

export default ScaleListTemplate;
