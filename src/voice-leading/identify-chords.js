// This file contains utility functions for identifying chords based on a set of notes
import { Note, Chord, Interval } from 'tonal';

export const identifyChordByNotes = (notes = []) => {
    try {
        const detected = Chord.detect(notes);
        return detected?.length ? detected[0] : null;
    }
    catch(e) {
        return null;
    }
}

export const identifyPossibleChords = (notes = []) => {
    return Chord.detect(notes);
}

export const getChordByTonicAndType = (tonicNote, chordType) => getChordInfoByName(`${tonicNote}${chordType}`);

export const getChordInfoByName = (name) => {
    try {
        if (!name?.length) {
            return null;
        }
        const chord = Chord.get(name);
        if (chord?.empty) {
            return null;
        }

        const quality = getChordQualityFromInfo(chord);
        const qualitySymbol = getShortChordSymbolByQuality(chord);
        return {
            ...chord,
            quality,
            qualitySymbol,
        };
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export const getShortChordSymbolByQuality = (chord) => {
    if (chord.type.includes('major seventh')) {
        return 'maj7';
    }
    if (chord.type.includes('minor seventh')) {
        return 'm7'
    }
    if (chord.type.includes('dominant')) {
        return '7'
    }
    if (chord.type.includes('augmented seventh') || chord.aliases.includes('7#5')) {
        return '7#5'
    }
    if (chord.type.includes('diminished seventh')) {
        return 'ø7';
    }
    if (chord.type.includes('suspended second')) {
        return 'sus2'
    }
    if (chord.type.includes('suspended fourth')) {
        return 'sus4'
    }
    if (chord.type.includes('half-diminished')) {
        return 'm7b5'
    }
    if (chord.type.includes('sixth')) {
        return '6';
    }
    if (chord.type.includes('augmented')) {
        return '+'
    }
    if (chord.type.includes('diminished')) {
        return 'ø';
    }

    return '';
}

export const getChordNotesByTonicAndType = (tonic, chordType) => {
    const normalizedTonic = `${tonic}3`;

    return Chord.notes(chordType, normalizedTonic);
}

// Returns Variations of Chord with common extensions
export const getExtendedChordVariations = (chordName) => {
    return Chord.extended(chordName);
}

// Takes in a chord object and returns the scale degrees of its notes relative to the tonic
export const getScaleDegreePatternOfChord = (notes, tonicNote) => {
    const tonic = Note.simplify(tonicNote ? tonicNote : notes[0]);
    return notes.map((note) => {
        const simplifiedNote = Note.simplify(note);
        const hasAccidental = simplifiedNote[1] === '#' || simplifiedNote[1] === 'b';
        const noteWithoutOrdinal = hasAccidental ? simplifiedNote.substring(0, 2) : simplifiedNote[0];
        const distance = Interval.distance(tonic, noteWithoutOrdinal);
        if (distance[1] === 'P') {
            return distance[0];
        } else if (distance[1] === 'M') {
            return distance[0];
        } else if (distance[1] === 'A') {
            return `#${distance[0]}`;
        } else if (distance[1] === 'm') {
            if (distance[0] === '8' || distance[0] === '1') {
                return '7';
            }
            if (distance[0] === '4') {
                return '3';
            }
            return `b${distance[0]}`
        } else if (distance[1] === 'd') { // TODO - Test if this is accurate
            return `b${distance[0]}`;
        }
        return distance;
    });
}

// Returns a series of intervals representing the intervals between each note of an array
export const getIntervallicPatternOfNotes = (notes) => {
    if (!notes) {
        return [];
    }
    if (notes?.length < 2) {
        return [];
    }

    return normalizeIntervals(notes.map((note, index) => {
        if (index === notes.length - 1) {
            return '';
        }
        return Interval.distance(note, notes[index + 1]);
    }).filter((val) => val?.length))
}

const normalizeIntervals = (intervals) => {
    return intervals.map((interval) => {
        switch(interval){
            case '1A':
                return 'm2';
            case '3d':
                return 'M2';
            case '2A':
                return 'm3';
            case '4d':
                return 'M3';
            case '3A':
                return 'P4';
            case '5d':
            case 'd5':
            case '4A':
                return 'TT';
            case '6m':
                return 'A5';
            case 'b8':
                return 'M7';
            default:
                return `${interval[1]}${interval[0]}`;
        }
    })
}

export const getChordQualityFromInfo = (chordInfo = {}) => {
    const quality = chordInfo?.quality;
    if (quality === 'Unknown') {
        if (chordInfo?.symbol.includes('sus')) {
            return 'Suspended';
        }
        return chordInfo?.aliases[0] || quality;
    }

    return quality;
}
