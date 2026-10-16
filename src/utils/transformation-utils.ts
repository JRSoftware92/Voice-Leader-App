import {Interval, Note, Range} from "tonal";
import findIndex from "lodash/findIndex";

import type {Chord} from "../types/Chord.ts";
import {
    getChordInfoByName,
    getChordQualityFromInfo,
    getIntervallicPatternOfNotes,
    getScaleDegreePatternOfChord,
    identifyChordByNotes,
} from "../voice-leading/identify-chords";
import { normalizeAccidentals } from "../voice-leading/chord-transformations";

export const getDistanceBetweenNotes = (tonicA: string, tonicB: string): number => {
    return Interval.semitones(Note.distance(tonicA, tonicB));
}

export const generateRootlessTransformations = (chord: Chord, notesArr = []) => {
    const chordNotes = notesArr || chord?.notes;
    const rootNote = chordNotes[0];
    const nextNote = chordNotes[1];

    const distanceFromUpperBound = getDistanceBetweenNotes(rootNote, nextNote);
    const distanceFromLowerBound = distanceFromUpperBound - 12;

    const upperBoundNote = Note.transpose(rootNote, Interval.fromSemitones(distanceFromUpperBound - 1));
    const lowerBoundNote = Note.transpose(rootNote, Interval.fromSemitones(distanceFromLowerBound));

    const allBassNotes = Range.chromatic([lowerBoundNote, upperBoundNote]).filter((note) => note !== rootNote);

    const newNoteSets = allBassNotes.map((note) => {
        const newArr = [...chordNotes];
        newArr[0] = note;

        return newArr;
    })

    return newNoteSets.map((notes) => {
        const chordName = identifyChordByNotes(notes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(notes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(notes);

        const distance = Interval.semitones(Note.distance(rootNote, notes[0]));
        const absoluteDistance = Math.abs(distance);

        const indexInOriginalChord = findIndex(chordNotes, (note) => {
            return note.replace(/\d/g, '') === notes[0].replace(/\d/g, '');
        });
        let label = '';
        if (indexInOriginalChord > -1) {
            label = `Replace the bass note with note ${indexInOriginalChord + 1} of the chord`;
        } else {
            const direction = distance > 0 ? 'Up' : 'Down';
            label = `Move Bass of ${chord?.symbol} ${absoluteDistance} Semitone(s) ${direction}`;
        }
        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label,
            group: 'swap-bass',
            notes,
            chord: chordName,
            degrees,
            distance: absoluteDistance,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...chord,
                relativeIntervals: getIntervallicPatternOfNotes(chordNotes),
                notes: normalizeAccidentals(chordNotes),
            },
        }
    })
}

export const generateReplacementNoteSets = (notes = []) => {
    const output = []
    for (let i = 1; i < notes.length - 1; i++) {
        const lowerBound = Note.transpose(notes[i - 1], Interval.fromSemitones(1));
        const upperBound = Note.transpose(notes[i + 1], Interval.fromSemitones(-1));
        output.push(Range.chromatic([lowerBound, upperBound]).filter((note) => note !== notes[i]));
    }

    return output;
}

// Changes a single, non root note according to best practices in voice leading (no crossing over notes in the chord)
export const generateSingleNoteTransformations = (chord: Chord, notesArr = []) => {
    const chordNotes = notesArr || chord?.notes;
    const replacementNoteSets = generateReplacementNoteSets(chordNotes);
    const newChordObjects = replacementNoteSets.flatMap((noteSet, setIndex) => {
        const targetNoteIndex = setIndex + 1;
        const outputChords = [];
        for (let i = 0; i < noteSet.length - 1; i++) {
            const temp = [...chordNotes];
            temp[targetNoteIndex] = noteSet[i];
            outputChords.push({
                notes: [...temp],
                distance: Interval.semitones(Note.distance(chordNotes[targetNoteIndex], noteSet[i])),
                replacementIndex: targetNoteIndex,
            });
        }

        return outputChords;
    })

    return newChordObjects.map(({ notes, distance, replacementIndex }) => {
        const chordName = identifyChordByNotes(notes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(notes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(notes);

        const absoluteDistance = Math.abs(distance);

        const direction = distance > 0 ? 'Up' : 'Down';
        const label = `Move note ${replacementIndex + 1} of ${chord?.symbol} ${absoluteDistance} Semitone(s) ${direction}`;
        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label,
            group: 'oblique-motion',
            notes,
            chord: chordName,
            degrees,
            distance: absoluteDistance,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...chord,
                relativeIntervals: getIntervallicPatternOfNotes(notes),
                notes: normalizeAccidentals(notes),
            },
        }
    })
}
