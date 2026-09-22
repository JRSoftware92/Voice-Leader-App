import {Interval, Note, Scale} from 'tonal';

import range from 'lodash/range';
import reduce from "lodash/reduce";
import union from "lodash/union";

import {identifyChordByNotes} from "./identify-chords";

const MAJOR_MAP = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const MAJOR_ROMAN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii(dim)']
const ALL_MAJOR_NUMERALS = ['I', 'bii', 'ii', 'biii', 'iii', 'IV', '#IV', 'V', 'bvi', 'vi', 'bvii', 'vii'];

// Assumes VII is dominant for minor - need to look this up
const MINOR_MAP = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
const MINOR_ROMAN_NUMERALS = ['i', 'ii(dim)', 'III', 'iv', 'v', 'VI', 'VII']
const ALL_MINOR_NUMERALS = ['i', 'bii', 'ii(dim)', 'bIII', 'III', 'iv', '#iv', 'v', 'bVI', 'VI', 'bVII', 'VII']

export const getScaleNamesByNotes = (notes = [], tonic = null, exact = false) => {
    if (tonic) {
        return Scale.detect(notes, { tonic, match: exact ? 'exact' : 'fit' });
    }
    return Scale.detect(notes);
}

export const getScaleInfoByName = (scaleName) => {
    return Scale.get(scaleName);
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


