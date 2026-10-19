import React, { useState } from 'react';
import {Chord, Note} from "tonal";

import PianoKeyboard from '../../components/keyboard/PianoKeyboard.tsx';

import {
  getChordInfoByName, getHarmonicIntervalsOfNotes,
  identifyPossibleChords
} from "../../voice-leading/identify-chords";
import ChordList from "../../components/chord-list/ChordList.tsx";

export const ChordListTemplate = () => {
  const [notesArr, setNotes] = useState(['C3', 'E3', 'G3', 'B3']);
  const [selectedChord, setSelectedChord] = useState(null);

  const chordNames = identifyPossibleChords(notesArr);
  const chords = chordNames.map((name) => getChordInfoByName(name));

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

  const handleChordClick = (chord) => {
    if (selectedChord?.symbol !== chord.symbol) {
      setSelectedChord(chord);
    } else {
      setSelectedChord(null);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <ChordList
        chords={chords}
        selectedChordSymbol={selectedChord?.symbol}
        onClick={handleChordClick}
        onDelete={(chord) => console.log('Delete', chord)}
      />
      <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />
    </div>
  )
}

export default ChordListTemplate;
