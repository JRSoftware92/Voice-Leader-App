import {Interval, Note, Scale, Chord, RomanNumeral} from 'tonal';

import range from 'lodash/range';
import reduce from "lodash/reduce";
import union from "lodash/union";

import {identifyChordByNotes} from "./identify-chords";
import {deriveChordFromNotes, getPossibleChordsByNotes} from "./chord-derivation.js";

const MAJOR_MAP = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const MAJOR_ROMAN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii(dim)']
const ALL_MAJOR_NUMERALS = ['I', 'bii', 'ii', 'biii', 'iii', 'IV', '#IV', 'V', 'bvi', 'vi', 'bvii', 'vii'];

// Assumes VII is dominant for minor - need to look this up
const MINOR_MAP = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
const MINOR_ROMAN_NUMERALS = ['i', 'ii(dim)', 'III', 'iv', 'v', 'VI', 'VII']
const ALL_MINOR_NUMERALS = ['i', 'bii', 'ii(dim)', 'bIII', 'III', 'iv', '#iv', 'v', 'bVI', 'VI', 'bVII', 'VII']

const PARENT_MODES = ['major', 'melodic minor', 'harmonic minor']

export const getParentScale = (scaleName) => {
  // Get all modes relative to the given scale mode
  const modes = Scale.modeNames(scaleName);
  const parentModeIndex = modes.findIndex((mode) => PARENT_MODES.includes(mode[1]));
  const actualIndex = parentModeIndex > -1 ? parentModeIndex : 0;
  const parentScaleName = modes[actualIndex].join(' ');

  return Scale.get(parentScaleName);
}

export const getParentMajor = (scale) => {
  if (scale.empty) return null;

  const scaleName = scale.name;

  // Map modes to their scale degree step (1-indexed: Ionian=1, Dorian=2, Phrygian=3, Lydian=4, Mixolydian=5, Aeolian=6, Locrian=7)
  const modeOffsets = {
    ionian: "1P",
    dorian: "-2M",
    phrygian: "-3M",
    lydian: "-4P",
    mixolydian: "-5P",
    aeolian: "-6M",
    locrian: "-7m"
  };

  const scaleNameSplit = scaleName.split(" ");
  const [tonic, type] = scaleNameSplit;
  if (scaleNameSplit.length > 2) {
    return scale;
  }
  const normalizedType = type.toLowerCase();
  const offset = modeOffsets[normalizedType];

  if (!offset) return null;

  const parentTonic = Note.transpose(tonic, offset);
  const parentMajorName = `${parentTonic} major`
  return Scale.get(parentMajorName);
}

export const getScaleNamesByNotes = (notes = [], exact = false, tonic = null) => {
    const normalizedNotes = notes.map((note) => note.replace(/\d+/g, ''));
    if (tonic) {
        return Scale.detect(normalizedNotes, { tonic, match: exact ? 'exact' : 'fit' });
    }
    return Scale.detect(normalizedNotes, { match: exact ? 'exact' : 'fit'});
}

export const getScaleInfoByName = (scaleName) => {
    const parentScale = getParentScale(scaleName);
    const notes = parentScale.notes.map(note => Note.enharmonic(note));

    return {
      ...parentScale,
      notes
    };
}

export const getScaleTriadsByNotes = (notes = []) => {
  const len = notes.length;

  return notes.map((root, i) => {
    // Stack thirds: Root, 3rd (index + 2), 5th (index + 4)
    const third = notes[(i + 2) % len];
    const fifth = notes[(i + 4) % len];

    // Detect the chord name from the accumulated notes
    const detected = getPossibleChordsByNotes([root, third, fifth]);
    return detected[0] || `${root} (unknown)`;
  });
}

export const getScaleSeventhsByNotes = (notes = []) => {
  const len = notes.length;

  return notes.map((root, i) => {
    // Stack thirds: Root, 3rd (index + 2), 5th (index + 4)
    const third = notes[(i + 2) % len];
    const fifth = notes[(i + 4) % len];
    const seventh = notes[(i + 6) % len];

    // Detect the chord name from the accumulated notes
    // const detected = Chord.detect([root, third, fifth, seventh]);
    const detected = getPossibleChordsByNotes([root, third, fifth, seventh]);
    return detected[0] || `${root} (unknown)`;
  });
}

export const getScaleChordsByNotes = (notes = [], useSevenths = false) => {
  if (useSevenths) {
    return getScaleSeventhsByNotes(notes);
  } else {
    return getScaleTriadsByNotes(notes);
  }
}

const convertIntervalToScaleAlteration = (interval) => {
  if (interval.q === "m" || interval.q === "d") {
    return "b".repeat(Math.abs(interval.alt)); // Lowered degree
  } else if (interval.q === "A") {
    return "#".repeat(interval.alt); // Raised degree
  }
  return ''
}

export const getScalesMatchingChords = (chords = [], lessThanEightNotes = true) => {
  const noteSet = new Set();
  chords.forEach((chord) => {
    const chordNotes = chord.notes.forEach((note) => noteSet.add(note.replace(/\d/g, '')));
    return chordNotes
  })

  const approximateScales = getScaleNamesByNotes([...noteSet], false).map(scaleName => getScaleInfoByName(scaleName));
  return approximateScales.filter((scale) => {
    if (lessThanEightNotes) {
      return scale.notes.length < 8;
    }
    return scale.notes.some(note => !noteSet.has(note));
  }).sort((a, b) => a.name.length - b.name.length).sort((a, b) => b.notes.length - a.notes.length);
}

export const getRelativeScaleDegree = (tonic, targetNote)=> {
  const intervalName = Interval.distance(tonic, targetNote);
  const interval = Interval.get(intervalName);

  const degreeNumber = interval.num;
  const accidental = convertIntervalToScaleAlteration(interval);

  return `${accidental}${degreeNumber}`;
}

export const getRomanScaleDegree = (tonic, targetNote)=> {
  const intervalName = Interval.distance(tonic, targetNote);
  const interval = Interval.get(intervalName);

  return RomanNumeral.get(interval).name;
}

export const getNoteToNumeralList = (rootNote, isMinor = false) => {
    const numNotes = range(0, 12);
    const romanNumerals = isMinor ? ALL_MINOR_NUMERALS : ALL_MAJOR_NUMERALS;
    return reduce(numNotes, (acc, val, index) => {
        if (index === 0) {
            return [{ numeral: romanNumerals[0], note: rootNote }]
        }
        const prevNote = acc[index - 1].note;
        const nextNote = Note.simplify(Note.transpose(prevNote, Interval.fromSemitones(1)));

        return ([
            ...acc,
            {
                numeral: romanNumerals[index],
                note: nextNote
            }
        ])
    }, [])
}

export const getDiatonicChordsForScale = (scale, isMinor = false, includeSeventh = false) => {
    const notes = scale?.notes || [];
    const chordMap = isMinor ? MINOR_MAP : MAJOR_MAP;
    const numeralMap = isMinor ? MINOR_ROMAN_NUMERALS : MAJOR_ROMAN_NUMERALS;

    const dominantIndex = isMinor ? notes.length - 1 : notes.length - 3;
    const dominantNote = notes[dominantIndex]

    const allChords = notes.map((note, index) => {
        return ({
            label: `${note}${chordMap[index]}${includeSeventh ? '7' : ''}`,
            romanNumeral: numeralMap[index],
        })
    });

    return [
        ...allChords,
        {
            label:  `${dominantNote}dom`,
            romanNumeral: isMinor ? 'VII7' : 'V7',
        }
    ]
}

const derive7thChordsFromScaleNotes = (scaleNotes = [], useSevenths = true) => {
    return scaleNotes.map((rootNote, index) => {
        const noteRange = range(0, useSevenths ? 4 : 3);
        return noteRange.map((chordalIndex) => {
            const relativeIndex = (index + (chordalIndex * 2)) % 7;

            return scaleNotes[relativeIndex];
        })
    })
}

// Diatonic 7th chords for analysis derived by step
export const deriveDiatonicChordsForScale = (scale, useSevenths = true) => {
    const notes = scale?.notes || [];

    const chordNoteGroups = derive7thChordsFromScaleNotes(notes, useSevenths);
    const allChords = chordNoteGroups.map((noteGroup) => {
        return identifyChordByNotes(noteGroup);
    })

    return allChords;
}

export const getMatchingScalesForTwoChords = (chordA, chordB) => {
    const notesA = chordA?.notes || chordA || [];
    const notesB = chordB?.notes || chordB || [];

    const combinedNotes = union(notesA, notesB);

    return getScaleNamesByNotes(combinedNotes);
}


