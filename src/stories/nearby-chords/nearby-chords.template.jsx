import React, { useState } from 'react';

import { Note } from 'tonal';
import uniqBy from "lodash/uniqBy";

import {
  generateAllHalfStepContraryMovements,
  generateAllHalfStepMovements,
  generateAllHalfStepParallelMovements,
  generateAllTonicAdjustments,
  normalizeAccidentals,
  sortNotesInChromaticOrder
} from "../../voice-leading/chord-transformations";

import {
  getChordInfoByName,
  getIntervallicPatternOfNotes,
  getScaleDegreePatternOfChord,
  identifyChordByNotes
} from "../../voice-leading/identify-chords";

import NoteDropdown from "../../components/common/NoteDropdown/NoteDropdown";
import PianoKeyboard from "../../components/keyboard/PianoKeyboard.jsx";
import ChordList from "../../components/chord-list/ChordList.tsx";
import ChordListItem from "../../components/chord-list/ChordListItem.tsx";

const getSampleNotesFromDegrees = (intervals, rootNote = 'C') => {
  return normalizeAccidentals(intervals.map(Note.transposeFrom(rootNote)));
}

const onlyUniqueChords = (chords) => {
  return uniqBy(chords, (chord) => {
    const sortedChord = sortNotesInChromaticOrder(chord.notes);
    return sortedChord.join('-');
  })
}

const getAllTransformations = (intervals, originalChord = {}) => {
  const notes = getSampleNotesFromDegrees(intervals);

  const tonicAdjustments = generateAllTonicAdjustments(0, notes, originalChord);
  const halfStepMovements = generateAllHalfStepMovements(notes, originalChord);
  const parallelMotion = generateAllHalfStepParallelMovements(notes, originalChord);
  const contraryMotion = generateAllHalfStepContraryMovements(notes, originalChord);

  const allMovements = [
    ...tonicAdjustments,
    ...halfStepMovements,
    ...parallelMotion,
    ...contraryMotion,
  ];
  const chords = onlyUniqueChords(allMovements);
  return chords.filter(({ chord }) => chord !== null);
}

const TransformationSubEntry = ({
                                  transformation
                                }) => {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{display: 'flex', justifyContent: 'space-between' }}>
          <span>
            Chord Type
          </span>
          <span>---</span>
          <span>
            { transformation?.quality }
          </span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' }}>
          <span>
            { transformation?.prevChordInfo?.notes.join(',') }
          </span>
          <span>--</span>
          <span>
            { transformation?.notes.join(',') }
          </span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' }}>
          <span>
            { transformation?.prevChordInfo?.degrees?.join(',') }
          </span>
          <span>--</span>
          <span>
            { transformation?.degrees?.join(',') }
          </span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between' }}>
          <span>
            { transformation?.prevChordInfo?.relativeIntervals?.join('-') }
          </span>
          <span>--</span>
          <span>
            { transformation?.relativeIntervals?.join('-') }
          </span>
        </div>
      </div>
    </>
  )
}

const TransformationEntry = ({
                               transformation,
                             }) => {
  return (
    <ListItem>
      <ListItemText
        primary={`${transformation.label} = ${transformation.chord}`}
        secondary={<TransformationSubEntry transformation={transformation} />}
      />
    </ListItem>
  )
}

const TransformationList = ({ transformations }) => {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 800,
        bgColor: 'background.paper',
        overflow: 'auto',
        maxHeight: 400,
        padding: '1px'
      }}
    >
      {
        transformations.map((transformation) => (
          <TransformationEntry transformation={transformation} />
        ))
      }
    </List>
  )
}

export const NearbyChords = () => {
  const [root, setRoot] = useState('C');
  const [notes, setNotes] = useState(['C3', 'E3', 'G3']);

  const actualRoot = `${root}1`;
  const rootedNotes = [actualRoot, ...notes];
  const chordName = identifyChordByNotes(normalizeAccidentals(rootedNotes));
  const chord = getChordInfoByName(chordName);
  const degrees = notes?.length ? getScaleDegreePatternOfChord(notes, actualRoot) : [];
  const intervals = notes?.length ? getIntervallicPatternOfNotes(rootedNotes) : [];

  const chords = getAllTransformations(chord.intervals, { ...chord, notes: rootedNotes, degrees, intervals });

  const onKeyToggle = (id) => {
    if (notes.includes(id)) {
      setNotes(notes.filter((val) => val !== id));
    } else {
      setNotes([...notes, id]);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div className="flex flex-col justify-center items-center pb-4">
        <ChordListItem name={chord.symbol} notes={chord.notes} startNotes={chord.notes} degrees={degrees}/>
        <NoteDropdown
          id="note-selection-for-voicing-sample"
          label="Root Note"
          note={root}
          onNoteSelected={setRoot}
        />
      </div>
      <span className="font-bold">Nearby Chords</span>
      <ChordList chords={chords} rootChord={chord} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <PianoKeyboard selectedKeys={notes} onKeyToggle={onKeyToggle} />
      </div>
    </div>
  )
}

export default NearbyChords;
