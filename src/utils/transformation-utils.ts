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

    console.groupCollapsed('Transformation Function');
    console.log('chord', chord)
    console.log('Rootless Bass Bounds', lowerBoundNote, upperBoundNote)
    console.groupEnd();
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
        console.groupCollapsed('New Chord with root', notes[0]);
        console.log('chord', chordInfo);
        console.log('Distance', distance);
        console.log('Index', indexInOriginalChord)
        console.groupEnd();
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