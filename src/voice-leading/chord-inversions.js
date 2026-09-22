import { Collection, Interval } from 'tonal';

import orderBy from 'lodash/orderBy';

import {
    getChordInfoByName,
    getIntervallicPatternOfNotes,
    getScaleDegreePatternOfChord,
    identifyChordByNotes
} from "./identify-chords";
import uniqBy from "lodash/uniqBy";
import {normalizeAccidentals} from "./chord-transformations";

export const getAllCombinationsOfNotes = (notes) => Collection.permutations(notes);

export const getAllInversionsWithIntervalPatterns = (notes, tonicNote) => {
    const permutations = getAllCombinationsOfNotes(notes);

    const inversions = permutations.map((permutation) => {
        const intervals = getIntervallicPatternOfNotes(permutation, tonicNote);

        const hasLargeInterval = intervals.find((interval) => Interval.semitones(interval) > 6);
        return ({
            hasPerfectFifth: intervals.includes('5P') ? 1 : 0,
            hasPerfectFourth: intervals.includes('4P') ? 1 : 0,
            hasLargeInterval: hasLargeInterval ? 1 : 0,
            notes: permutation,
            intervals,
            isRootless: 0,
            degrees: getScaleDegreePatternOfChord(permutation, tonicNote || permutation[0])
        })
    });
    const rootlessInversions = inversions.map((inversion) => {
        const rootless = getRootlessInversionForChord(inversion.notes, tonicNote);
        const intervals = rootless.rootlessIntervals;
        const hasLargeInterval = intervals.find((interval) => Interval.semitones(interval) > 6);
        return ({
            hasLargeInterval: hasLargeInterval ? 1 : 0,
            hasPerfectFifth: intervals.includes('5P') ? 1 : 0,
            hasPerfectFourth: intervals.includes('4P') ? 1 : 0,
            tonic: tonicNote,
            notes: rootless.rootlessNotes,
            degrees: rootless.rootlessDegrees,
            intervals: rootless.rootlessIntervals,
            isRootless: 1,
        })
    })

    const allInversions = [...inversions, ...rootlessInversions];

    return uniqBy(allInversions, (inversion) => inversion.intervals.join('-'));
}

export const getAllInversionsForChordByNotes = (notes) => {
    const chordName = identifyChordByNotes(notes);
    const chord = getChordInfoByName(chordName);
    //const tonic = chord?.tonic || notes[0];

    const inversions = orderBy(getAllInversionsWithIntervalPatterns(notes, 'C'), ['hasLargeInterval', 'isRootless', 'hasPerfectFifth', 'hasPerfectFourth'], ['asc', 'desc', 'asc', 'desc']);

    return {
        ...chord,
        inversions,
    }
}

export const getRootlessInversionForChord = (notes, tonic) => {
    const rootlessNotes = notes.filter((note) => note !== tonic);
    const rootlessIntervals = getIntervallicPatternOfNotes(rootlessNotes);
    const rootlessDegrees = getScaleDegreePatternOfChord(rootlessNotes, tonic)

    return {
        rootlessNotes, rootlessIntervals, rootlessDegrees,
    }
}
