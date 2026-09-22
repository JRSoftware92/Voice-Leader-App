/**
 * A master utility collection of transformation functions for voice leading between chords
 */

import { Interval, Note } from 'tonal';

import intersection from "lodash/intersection";
import difference from "lodash/difference";
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';

import {
    getChordByTonicAndType,
    getChordInfoByName, getChordQualityFromInfo,
    getIntervallicPatternOfNotes,
    getScaleDegreePatternOfChord,
    identifyChordByNotes
} from "./identify-chords";

// TODO - Fix Scale Degree identification - use the root of the identified chord instead of the root note of the series
// TODO - Fix Overlapping note identification - currently ruined by enharmonics

const formatCount = (index = 0) => {
    if (index === 1) {
        return '1st';
    }
    if (index === 2) {
        return '2nd'
    }
    if (index === 3) {
        return '3rd';
    }
    return `${index}th`;
}

const moveOneLetterDown = (cardinalNote) => {
    switch (cardinalNote) {
        case 'A':
            return 'G';
        case 'B':
            return 'A';
        case 'C':
            return 'B';
        case 'D':
            return 'C';
        case 'E':
            return 'D';
        case 'F':
            return 'E';
        case 'G':
            return 'F';
        default:
            return cardinalNote;
    }
}

const moveOneLetterUp = (cardinalNote) => {
    switch (cardinalNote) {
        case 'A':
            return 'B';
        case 'B':
            return 'C';
        case 'C':
            return 'D';
        case 'D':
            return 'E';
        case 'E':
            return 'F';
        case 'F':
            return 'G';
        case 'G':
            return 'A';
        default:
            return cardinalNote;
    }
}

export const convertFlatsToSharps = (notes) => {
    return notes.map((note) => {
        if (note[1] === 'b') {
            const ordinal = note[2] || '';
            return `${moveOneLetterDown(note[0])}#${ordinal}`;
        }
        return note;
    })
}

export const convertSharpsToFlats = (notes) => {
    return notes.map((note) => {
        if (note[1] === '#') {
            const ordinal = note[2] || '';
            return `${moveOneLetterUp(note[0])}b${ordinal}`;
        }
        return note;
    })
}

export const fixErroneousFlatsAndSharps = (notes) => {
    return notes.map((note) => {
        const hasAccidental = note[1] === '#' || note[1] === 'b';
        const noteWithoutOrdinal = hasAccidental ? note.substring(0, 2) : note[0];
        const ordinal = hasAccidental ? note[2] : note[1];
        if (noteWithoutOrdinal === 'E#') {
            return `F${ordinal || ''}`;
        }
        if (noteWithoutOrdinal === 'Fb') {
            return `E${ordinal || ''}`;
        }
        if (noteWithoutOrdinal === 'Cb') {
            return `B${ordinal || ''}`;
        }
        if (noteWithoutOrdinal === 'B#') {
            return `C${ordinal || ''}`;
        }

        return note;
    });
}

export const normalizeAccidentals = (notes) => {
    return convertSharpsToFlats(fixErroneousFlatsAndSharps(notes));
}

export const moveNthNoteByXSemitones = (n, x, notes) => {
    const note = notes[n];
    const newNote = Note.transpose(note, Interval.fromSemitones(x));

    const newNotes = [...notes];
    newNotes[n] = newNote;

    return normalizeAccidentals(newNotes);
}

export const moveIntervalByXSemitones = (notePosA, notePosB, x, notes) => {
    const noteA = notes[notePosA];
    const noteB = notes[notePosB];

    const newA = Note.transpose(noteA, Interval.fromSemitones(x));
    const newB = Note.transpose(noteB, Interval.fromSemitones(x));

    const newNotes = [...notes];
    newNotes[notePosA] = newA;
    newNotes[notePosB] = newB;

    return normalizeAccidentals(newNotes);
}

/**
 * Assumes note B is greater than A
 * @param notePosA
 * @param notePosB
 * @param x
 * @param notes
 * @returns {*[]}
 */
export const moveIntervalInByXSemitones = (notePosA, notePosB, x, notes) => {
    const noteA = notes[notePosA];
    const noteB = notes[notePosB];

    const newA = Note.transpose(noteA, Interval.fromSemitones(x));
    const newB = Note.transpose(noteB, Interval.fromSemitones((-1 * x)));

    const newNotes = [...notes];
    newNotes[notePosA] = newA;
    newNotes[notePosB] = newB;

    return normalizeAccidentals(newNotes);
}

/**
 * Assumes note B is greater than A
 * @param notePosA
 * @param notePosB
 * @param x
 * @param notes
 * @returns {*[]}
 */
export const moveIntervalOutByXSemitones = (notePosA, notePosB, x, notes) => {
    const noteA = notes[notePosA];
    const noteB = notes[notePosB];

    const newA = Note.transpose(noteA, Interval.fromSemitones((-1 * x)));
    const newB = Note.transpose(noteB, Interval.fromSemitones(x));

    const newNotes = [...notes];
    newNotes[notePosA] = newA;
    newNotes[notePosB] = newB;

    return normalizeAccidentals(newNotes);
}

export const moveChordalRootByXSemitones = (x, notes) => moveNthNoteByXSemitones(1, x, notes);

export const getDominantRootedInTonic = (note) => {
    return getChordByTonicAndType(note, 'dom');
}

export const getDominantChordOfTonicKey = (tonicNote) => {
    const newTonic = Note.transpose(tonicNote, '5P');
    return getDominantRootedInTonic(newTonic);
}

export const getSubDominantChordOfTonicKey = (tonicNote) => {
    const newTonic = Note.transpose(tonicNote, '4P');
    return getDominantRootedInTonic(newTonic);
}

export const getTritoneDominantOfTonicNote = (tonicNote) => {
    const newTonic = Note.transpose(tonicNote, '4A');
    return getDominantRootedInTonic(newTonic);
}

export const getTritoneSubDominantOfTonicNote = (tonicNote) => {
    const perfectFourth = Note.transpose(tonicNote, '4P');
    const newTonic = Note.transpose(perfectFourth, '4A');
    return getDominantRootedInTonic(newTonic);
}

export const getBackdoorDominantOfTonicNote = (tonicNote) => {
    const newTonic = Note.transpose(tonicNote, '7m');
    return getDominantRootedInTonic(newTonic);
}

export const getBackdoorSubDominantOfTonicNote = (tonicNote) => {
    const perfectFourth = Note.transpose(tonicNote, '4P');
    const newTonic = Note.transpose(perfectFourth, '7m');
    return getDominantRootedInTonic(newTonic);
}

export const sortNotesInChromaticOrder = (notes) => Note.sortedUniqNames(notes);

export const getAllIndexPairingsWithinARange = (start, end) => {
    const indexRange = range(start, end);
    return reduce(indexRange, (acc, val) => {
        if (val === end) {
            return acc;
        }
        const innerRange = range(val + 1, end);
        const innerResults = innerRange.map((nextVal) => [val, nextVal]);

        return ([
            ...acc,
            ...innerResults,
        ]);
    }, []);
}

export const generateAllHalfStepMovements = (notes, originalChord = {}) => {
    const movementsUp = notes.map((note, index) => {
        const newNotes = moveNthNoteByXSemitones(index, 1, notes);
        const chordName = identifyChordByNotes(newNotes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(newNotes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(newNotes);
        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label: `Move ${formatCount(index + 1)} Note of ${originalChord.symbol} 1 Half Step Up`,
            group: 'note-half-step-up',
            notes: newNotes,
            chord: chordName,
            originalNote: note,
            degrees,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals: getIntervallicPatternOfNotes(originalChord.notes),
                notes: normalizeAccidentals(notes),
            },
        }
    });
    const movementsDown = notes.map((note, index) => {
        const newNotes = moveNthNoteByXSemitones(index, -1, notes);
        const chordName = identifyChordByNotes(newNotes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(newNotes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(newNotes);
        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label: `Move ${formatCount(index + 1)} Note of ${originalChord.symbol} 1 Half Step Down`,
            group: 'note-change',
            notes: newNotes,
            chord: chordName,
            originalNote: note,
            degrees,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals: getIntervallicPatternOfNotes(originalChord.notes),
                notes: normalizeAccidentals(notes),
            },
        }
    });

    return [
        ...movementsUp,
        ...movementsDown,
    ]
}

export const generateAllTonicAdjustments = (tonicIndex, notes, originalChord = {}) => {
    const modifierRange = range(1, 12);
    return modifierRange.map((val) => {
        const newNotes = moveNthNoteByXSemitones(tonicIndex, (-1 * val), notes);
        const chordName = identifyChordByNotes(newNotes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(newNotes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(newNotes);

        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label: `Move Bass of ${originalChord?.symbol} ${val} Semitone(s) Down`,
            group: 'swap-bass',
            notes: newNotes,
            chord: chordName,
            degrees,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals: getIntervallicPatternOfNotes(originalChord?.notes),
                notes: normalizeAccidentals(notes),
            },
        }
    })
}

export const generateAllHalfStepParallelMovements = (notes, originalChord = {}) => {
    const indexPairs = getAllIndexPairingsWithinARange(0, notes.length);
    const movementsUp = indexPairs.map((interval) => {
        const newNotes = moveIntervalByXSemitones(interval[0], interval[1], 1, notes)
        const chordName = identifyChordByNotes(newNotes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(newNotes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(newNotes);
        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label: `Move ${formatCount(interval[0] + 1)} and ${formatCount(interval[1] + 1)} notes of ${originalChord.symbol} 1 Half Step Up`,
            group: 'parallel-motion',
            notes: newNotes,
            chord: chordName,
            originalInterval: interval,
            degrees,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals: getIntervallicPatternOfNotes(originalChord.notes),
                notes: normalizeAccidentals(notes),
            },
        }
    });
    const movementsDown = indexPairs.map((interval) => {
        const newNotes = moveIntervalByXSemitones(interval[0], interval[1], -1, notes)
        const chordName = identifyChordByNotes(newNotes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(newNotes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(newNotes);
        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label: `Move ${formatCount(interval[0] + 1)} and ${formatCount(interval[1] + 1)} notes of ${originalChord.symbol} 1 Half Step Down`,
            group: 'parallel-motion',
            notes: newNotes,
            chord: chordName,
            originalInterval: interval,
            degrees,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals: getIntervallicPatternOfNotes(originalChord.notes),
                notes: normalizeAccidentals(notes),
            },
        }
    });

    return [...movementsUp, ...movementsDown];
}

export const generateAllHalfStepContraryMovements = (notes, originalChord = {}) => {
    const indexPairs = getAllIndexPairingsWithinARange(0, notes.length);
    const movementsIn = indexPairs.map((interval) => {
        const newNotes = moveIntervalInByXSemitones(interval[0], interval[1], 1, notes)
        const chordName = identifyChordByNotes(newNotes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(newNotes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(newNotes);

        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label: `Move ${formatCount(interval[0] + 1)} and ${formatCount(interval[1] + 1)} notes of ${originalChord.symbol} 1 Half Step In`,
            group: 'contrary-motion',
            notes: newNotes,
            chord: chordName,
            originalInterval: interval,
            degrees,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals: getIntervallicPatternOfNotes(originalChord.notes),
                notes: normalizeAccidentals(notes),
            },
        }
    });
    const movementsOut = indexPairs.map((interval) => {
        const newNotes = moveIntervalOutByXSemitones(interval[0], interval[1], 1, notes)
        const chordName = identifyChordByNotes(newNotes);
        const chordInfo = getChordInfoByName(chordName);
        const degrees = chordInfo ? getScaleDegreePatternOfChord(newNotes, chordInfo.tonic) : null;
        const intervals = getIntervallicPatternOfNotes(newNotes);

        return {
            ...chordInfo,
            quality: getChordQualityFromInfo(chordInfo),
            label: `Move ${formatCount(interval[0] + 1)} and ${formatCount(interval[1] + 1)} notes of ${originalChord.symbol} 1 Half Step Out`,
            group: 'contrary-motion',
            notes: newNotes,
            chord: chordName,
            originalInterval: interval,
            degrees,
            relativeIntervals: intervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals: getIntervallicPatternOfNotes(originalChord.notes),
                notes: normalizeAccidentals(notes),
            },
        }
    });

    return [...movementsIn, ...movementsOut];
}

const getAllDominantsForTonicNote = (tonicNote, originalChord) => {
    const diatonic = getDominantChordOfTonicKey(tonicNote);
    const backdoor = getBackdoorDominantOfTonicNote(tonicNote);
    const tritone = getTritoneDominantOfTonicNote(tonicNote);

    const diatonicDegrees = diatonic ? getScaleDegreePatternOfChord(diatonic.notes, diatonic.tonic) : null;
    const diatonicIntervals = getIntervallicPatternOfNotes(diatonic.notes);

    const backdoorDegrees = backdoor ? getScaleDegreePatternOfChord(backdoor.notes, backdoor.tonic.tonic) : null;
    const backdoorIntervals = getIntervallicPatternOfNotes(backdoor.notes);

    const tritoneDegrees = tritone ? getScaleDegreePatternOfChord(tritone.notes, tritone.tonic) : null;
    const tritoneIntervals = getIntervallicPatternOfNotes(tritone.notes);

    const relativeIntervals = getIntervallicPatternOfNotes(originalChord.notes);

    return [
        {
            id: 'diatonicDominant',
            group: 'secondary-dominant',
            label: `Dominant of ${tonicNote}`,
            notes: normalizeAccidentals(diatonic.notes),
            chord: diatonic.name,
            degrees: diatonicDegrees,
            relativeIntervals: diatonicIntervals,
            chordKey: 'dom',
            quality: 'Dominant',
            prevChordInfo: {
                ...originalChord,
                relativeIntervals,
                notes: normalizeAccidentals(originalChord.notes),
            },
        },
        {
            id: 'backdoorDominant',
            group: 'secondary-dominant',
            label: `Backdoor Dominant of ${tonicNote}`,
            notes: normalizeAccidentals(backdoor.notes),
            chord: backdoor.name,
            degrees: backdoorDegrees,
            relativeIntervals: backdoorIntervals,
            chordKey: 'dom',
            quality: 'Dominant',
            prevChordInfo: {
                ...originalChord,
                relativeIntervals,
                notes: normalizeAccidentals(originalChord.notes),
            },
        },
        {
            id: 'tritoneSub',
            group: 'secondary-dominant',
            label: `Tritone Substitution of ${tonicNote}7`,
            notes: normalizeAccidentals(tritone.notes),
            chord: tritone.name,
            chordKey: 'dom',
            quality: 'Dominant',
            degrees: tritoneDegrees,
            relativeIntervals: tritoneIntervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals,
                notes: normalizeAccidentals(originalChord.notes),
            },
        }
    ]
}

const getAllSubDominantsForTonicNote = (tonicNote, originalChord) => {
    const diatonic = getSubDominantChordOfTonicKey(tonicNote);
    const backdoor = getBackdoorSubDominantOfTonicNote(tonicNote);
    const tritone = getTritoneSubDominantOfTonicNote(tonicNote);

    const diatonicDegrees = diatonic ? getScaleDegreePatternOfChord(diatonic.notes, diatonic.tonic) : null;
    const diatonicIntervals = getIntervallicPatternOfNotes(diatonic.notes);

    const backdoorDegrees = backdoor ? getScaleDegreePatternOfChord(backdoor.notes, backdoor.tonic) : null;
    const backdoorIntervals = getIntervallicPatternOfNotes(backdoor.notes);

    const tritoneDegrees = tritone ? getScaleDegreePatternOfChord(tritone.notes, tritone.tonic) : null;
    const tritoneIntervals = getIntervallicPatternOfNotes(tritone.notes);

    const relativeIntervals = getIntervallicPatternOfNotes(originalChord.notes);

    return [
        {
            id: 'diatonicSubDominant',
            group: 'secondary-dominant',
            label: `Subdominant of ${tonicNote}`,
            notes: normalizeAccidentals(diatonic.notes),
            chord: diatonic.name,
            degrees: diatonicDegrees,
            relativeIntervals: diatonicIntervals,
            chordKey: 'dom',
            quality: 'Dominant',
            prevChordInfo: {
                ...originalChord,
                relativeIntervals,
                notes: normalizeAccidentals(originalChord.notes),
            },
        },
        {
            id: 'backdoorSubDominant',
            group: 'secondary-dominant',
            label: `Backdoor Subdominant of ${tonicNote}`,
            notes: normalizeAccidentals(backdoor.notes),
            chord: backdoor.name,
            degrees: backdoorDegrees,
            relativeIntervals: backdoorIntervals,
            chordKey: 'dom',
            quality: 'Dominant',
            prevChordInfo: {
                ...originalChord,
                relativeIntervals,
                notes: normalizeAccidentals(originalChord.notes),
            },
        },
        {
            id: 'tritoneSubDominant',
            group: 'secondary-dominant',
            label: `Tritone Subdominant Substitution of ${tonicNote}7`,
            notes: normalizeAccidentals(tritone.notes),
            chord: tritone.name,
            chordKey: 'dom',
            quality: 'Dominant',
            degrees: tritoneDegrees,
            relativeIntervals: tritoneIntervals,
            prevChordInfo: {
                ...originalChord,
                relativeIntervals,
                notes: normalizeAccidentals(originalChord.notes),
            },
        }
    ]
}

const generateListOfTransformationsForPriorChord = (notes, priorChord = {}, melodyNote = null) => {
    if (!priorChord) {
        return [];
    }

    const tonicAdjustments = generateAllTonicAdjustments(0, notes, priorChord);
    const halfStepMovements = generateAllHalfStepMovements(notes, priorChord);
    const parallelMotion = generateAllHalfStepParallelMovements(notes, priorChord);
    const contraryMotion = generateAllHalfStepContraryMovements(notes, priorChord);

    const tonicNote = notes[0];
    const subdominantTransformations = getAllSubDominantsForTonicNote(tonicNote, priorChord);

    return [
        ...subdominantTransformations,
        ...tonicAdjustments,
        ...halfStepMovements,
        ...parallelMotion,
        ...contraryMotion,
    ]
}

const generateListOfTransformationsForTargetChord = (notes, targetChord = {}, melodyNote = null) => {
    if (!targetChord) {
        return [];
    }

    const tonicAdjustments = generateAllTonicAdjustments(0, notes, targetChord);
    const halfStepMovements = generateAllHalfStepMovements(notes, targetChord);
    const parallelMotion = generateAllHalfStepParallelMovements(notes, targetChord);
    const contraryMotion = generateAllHalfStepContraryMovements(notes, targetChord);

    const tonicNote = notes[0];
    const dominantTransformations = getAllDominantsForTonicNote(tonicNote, targetChord);

    return [
        ...tonicAdjustments,
        ...halfStepMovements,
        ...parallelMotion,
        ...contraryMotion,
        ...dominantTransformations
    ];
}

const onlyUniqueChords = (chords) => {
    return uniqBy(chords, (chord) => {
        const sortedChord = sortNotesInChromaticOrder(normalizeAccidentals(chord.notes));
        return sortedChord.join('-');
    })
}

// Higher = worse
const detectOverlapForEachNote = (notes, homeNotes, targetNotes, melodyNote) => {
    const melodyNotes = melodyNote ? [melodyNote] : [];

    const homeMatching = intersection(notes, homeNotes);
    const targetMatching = intersection(notes, targetNotes);
    const melodyMatching = intersection(notes, melodyNotes);

    const overlappingMatches = intersection(homeMatching, targetMatching, melodyMatching);

    const homeSet = difference(homeMatching, overlappingMatches);
    const targetSet = difference(targetMatching, overlappingMatches);
    const melodySet = difference(melodyMatching, overlappingMatches);

    const allMatches = [...homeSet, ...targetSet, ...melodySet, ...overlappingMatches];

    const noMatches = difference(notes, allMatches);

    // First find which notes are shared between notes, and each set
    // Then find which notes are in more than one set by checking those
    return {
        notes: notes,
        home: homeSet,
        target: targetSet,
        melody: melodySet,
        overlap: overlappingMatches,
        noMatches: noMatches,
    }
}

// Higher is better
const calculateTransformationLikenessScore = (transformation, prevChord, targetChord, melodyNote) => {
    const overlapSets = detectOverlapForEachNote(transformation.notes, prevChord?.notes, targetChord?.notes, melodyNote);
    const { home, target, melody } = overlapSets;
    return reduce(transformation.notes,(acc, val) => {
        let mod = 0;

        if (home.includes(val)) {
            mod += 5;
        }
        else if (target.includes(val)) {
            mod += 5;
        }
        if (melody.includes(val)) {
            mod += 2;
        }

        return acc + mod;
    }, 0);
}

// TODO - Adjust scoring System - numbers not exceeding 50% (seemingly)
// TODO - Fix Scale Degrees on Transformations - some showing more than there are notes
// - Situations to handle:
//   - A note becoming an existing note in the structure, doubling the note
//     - How is this accounted for in scoring???
//       - Calculate the difference anyway?
//       - Exclude Notes that have already been counted?
//   - Half Differences - note is the same in one chord, but different from another
//     - How to score these compared to notes not present in either chord?
//   - Notes changing position in the chord
//     - So if a note goes from index 1 to index 2 = it's still in the chord.
//       - Need to only calculate the distance of the note is entirely nonexistent to that chord
//   - Scoring Differences between both chords
//     - If different between both chords - take minimum distance? max? or both?
const calculateTransformationDifferenceScore = (transformation, prevChord, targetChord, melodyNote) => {
    const overlapSets = detectOverlapForEachNote(transformation.notes, prevChord?.notes, targetChord?.notes, melodyNote);
    const { overlap } = overlapSets;

    return reduce(transformation.notes,(acc, val, index, list) => {
        let mod = 0;

        // if (overlap.includes(val) && val !== melodyNote) {
        //     return acc;
        // }

        const homeNote = prevChord ? prevChord.notes[index] : null;
        const targetNote = targetChord ? targetChord.notes[index] : null;
        const distanceFromHome = homeNote !== null ? Math.abs(Interval.semitones(Interval.simplify(Note.distance(homeNote, val)))) : 12;
        const fixedHomeDist = distanceFromHome > 6 ? 12 - distanceFromHome : distanceFromHome;
        const distanceFromTarget = targetNote !== null ? Math.abs(Interval.semitones(Interval.simplify(Note.distance(val, targetNote)))) : 12;
        const fixedTargetDist = distanceFromTarget > 6 ? 12 - distanceFromTarget : distanceFromTarget;

        const distance = fixedHomeDist + fixedTargetDist;
        mod += distance

        return acc + mod;
    }, 0);
}

const calculatedSemitonalDistanceScore = (transformation, prevChord, targetChord, melodyNote) => {
    const overlapSets = detectOverlapForEachNote(transformation.notes, prevChord?.notes, targetChord?.notes, melodyNote);
    const { overlap } = overlapSets;

    return reduce(transformation.notes,(acc, val, index, list) => {
        let mod = 0;

        // if (overlap.includes(val) && val !== melodyNote) {
        //     return acc;
        // }

        const homeNote = prevChord ? prevChord.notes[index] : null;
        const targetNote = targetChord ? targetChord.notes[index] : null;
        const distanceFromHome = homeNote !== null ? Math.abs(Interval.semitones(Interval.simplify(Note.distance(homeNote, val)))) : 12;
        // const fixedHomeDist = distanceFromHome > 6 ? 12 - distanceFromHome : distanceFromHome;
        const distanceFromTarget = targetNote !== null ? Math.abs(Interval.semitones(Interval.simplify(Note.distance(val, targetNote)))) : 12;
        // const fixedTargetDist = distanceFromTarget > 6 ? 12 - distanceFromTarget : distanceFromTarget;

        const distance = (distanceFromHome + distanceFromTarget) / 2;
        mod += distance

        return acc + mod;
    }, 0) / transformation.notes.length;
}

const calculatedNoteDifferenceScore = (transformation, prevChord, targetChord, melodyNote) => {
    const overlapSets = detectOverlapForEachNote(transformation.notes, prevChord?.notes, targetChord?.notes, melodyNote);
    const { overlap } = overlapSets;

    return reduce(transformation.notes,(acc, val, index, list) => {
        let mod = 0;

        // if (overlap.includes(val) && val !== melodyNote) {
        //     return acc;
        // }

        const homeNote = prevChord ? prevChord.notes[index] : null;
        const targetNote = targetChord ? targetChord.notes[index] : null;

        const homeDistance = homeNote === val ? 0 : 1;
        const targetDistance = targetNote === val ? 0 : 1;

        const distance = (homeDistance + targetDistance);
        mod += distance

        return acc + mod;
    }, 0);
}


// TODO - Adjust scoring based on presence of melody note, and if there are two neighbors or 1
//  - This will affect the top scoring, and as a result the offset and percentage values
export const sortTransformationsByPriority = (transformations, prevChord = {}, targetChord = {}, melodyNote = null) => {
    // TODO - Grade each transformation by how many overlapping notes there are
    // - Multiple overlaps and melody note overlaps are scored even higher
    // - Larger note differences are scored lower
    if (!prevChord) {
        return transformations;
    }
    const scoredTransformations = transformations.map((transformation) => {
        //const likeness = calculateTransformationLikenessScore(transformation, prevChord, targetChord, melodyNote);
        //const differenceScore = calculateTransformationDifferenceScore(transformation, prevChord, targetChord, melodyNote);

        // const numNotes = prevChord?.notes?.length;
        // const halfMaxScore = numNotes * 12;
        // const maxScore = halfMaxScore * 2;
        // const totalScore = ((likeness - differenceScore) + halfMaxScore) / maxScore;

        const noteScore = calculatedNoteDifferenceScore(transformation, prevChord, targetChord, melodyNote);
        const distanceScore = calculatedSemitonalDistanceScore(transformation, prevChord, targetChord, melodyNote);
        return {
            ...transformation,
            distanceScore,
            noteScore,
        }
    })

    return orderBy(scoredTransformations, ['noteScore', 'distanceScore', 'group'], ['asc', 'asc', 'asc']);
}

// TODO - Identify which scale degrees are modified for each chord
/**
 *
 * @param priorChord - chord object with at least its notes, and optionally tonic
 * @param targetChord - chord object with at least its notes, and optionally tonic
 * @param melodyNote - string note value i.e. A-G, Ab, C#, etc.
 */
export const generateAllPassingChordTransformations = (priorChord = null, targetChord = null, melodyNote = null) => {
    if (!priorChord && !targetChord) {
        return [];
    }

    const priorTransformations = priorChord ? generateListOfTransformationsForPriorChord(priorChord.notes, priorChord, melodyNote) : [];
    const targetTransformations = targetChord ? generateListOfTransformationsForTargetChord(targetChord.notes, targetChord, melodyNote) : [];

    const uniqueTransformations = onlyUniqueChords([...priorTransformations, ...targetTransformations]);

    return sortTransformationsByPriority(uniqueTransformations, priorChord, targetChord, melodyNote);
};

export const generateAllVoicingTransformations = (tonicIndex, notes, originalChord = {}) => {
    if (!notes?.length) {
        return [];
    }

    const tonicAdjustments = generateAllTonicAdjustments(tonicIndex, notes, originalChord);
    const halfStepMovements = generateAllHalfStepMovements(notes, originalChord);
    const parallelMotion = generateAllHalfStepParallelMovements(notes, originalChord);
    const contraryMotion = generateAllHalfStepContraryMovements(notes, originalChord);

    return [
        ...tonicAdjustments,
        ...halfStepMovements,
        ...parallelMotion,
        ...contraryMotion,
    ].filter(({ chord }) => chord !== null);
}
