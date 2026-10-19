import React, { useState } from 'react';
import {Chord, transpose} from "tonal";

import PianoKeyboard from '../../components/keyboard/PianoKeyboard.tsx';

import {
  getChordInfoByName,
  identifyPossibleChords
} from "../../voice-leading/identify-chords";
import ChordList from "../../components/chord-list/ChordList.tsx";
import ScaleList from "../../components/scale-list/ScaleList.tsx";
import {getPianoSampler, playChordSampler} from "../../utils/music.js";
import {getScalesMatchingChords} from "../../voice-leading/identify-scales.js";

export const ChordListTemplate = () => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);
  const [selectedChords, setSelectedChords] = useState([]);

  const chordNames = identifyPossibleChords(notesArr);
  const chords = chordNames.map((name) => getChordInfoByName(name));

  const sampler = getPianoSampler();

  const onKeyToggle = (id) => {
    if (notesArr.includes(id)) {
      setNotes(notesArr.filter((val) => val !== id));
    } else {
      setNotes([...notesArr, id]);
    }
  }

  const handleChordClick = (thisChord) => {
    if (selectedChords.findIndex((chord) => chord.name === thisChord.name) < 0) {
      setSelectedChords([...selectedChords, thisChord]);
    }
  }

  const handleSelectedChordClick = (thisChord) => {
    const notes = thisChord.intervals.map(interval => transpose(`${thisChord.tonic}3`, interval));
    playChordSampler(sampler, notes);
  }

  const onChordDelete = (thisChord) => {
    setSelectedChords(selectedChords.filter((chord) => chord.symbol !== thisChord.symbol));
  }

  const matchingScales = getScalesMatchingChords(selectedChords, true);

  return (
    <div className="flex flex-col items-center w-full">
      <ChordList
        chords={chords}
        onClick={handleChordClick}
      />
      <ChordList
        chords={selectedChords}
        onClick={handleSelectedChordClick}
        onDelete={onChordDelete}
      />
      <ScaleList scales={matchingScales} />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />
    </div>
  )
}

export default ChordListTemplate;
