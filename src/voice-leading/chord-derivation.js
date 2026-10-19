import uniq from 'lodash/uniq';

import {getHarmonicIntervalsOfNotes, normalizeIntervalToTwoOctaves } from "./identify-intervals.js";
import {TriadType} from "../types/Chord.ts";

import { INTERVAL_CHECKER as Intervals } from "./identify-intervals.js";

export const deriveTriadTypeByIntervals = (intervals = []) => {
  const majorThird = Intervals.third(intervals);
  const minorThird = Intervals.minorThird(intervals);

  const majorSecond = Intervals.second(intervals);

  const fourth = Intervals.fourth(intervals);
  const fifth = Intervals.fifth(intervals);
  const augmentedFifth = Intervals.augFifth(intervals);
  const diminishedFifth = Intervals.dimFifth(intervals);

  if (augmentedFifth && majorThird) {
    return TriadType.AUGMENTED;
  }
  if (diminishedFifth && minorThird) {
    return TriadType.DIMINISHED;
  }
  if (fifth) {
    if (majorThird) {
      return TriadType.MAJOR;
    }
    if (minorThird) {
      return TriadType.MINOR;
    }
    if (majorSecond) {
      return TriadType.SUSPENDED_SECOND;
    }
    if (fourth) {
      return TriadType.SUSPENDED_FOURTH;
    }
  }

  return null;
}

const isThirteenthChord = (intervals) => {
  return Intervals.thirteenth(intervals) && isEleventhChord(intervals);
}

const isEleventhChord = (intervals) => {
  return Intervals.ninth(intervals) && (Intervals.eleventh(intervals));
}

export const deriveExtensionFromIntervals = (intervals = []) => {
  const triadType = deriveTriadTypeByIntervals(intervals);

  const majorThird = Intervals.third(intervals);
  const minorThird = Intervals.minorThird(intervals);
  const majorSeventh = Intervals.seventh(intervals);
  const minorSeventh = Intervals.minorSeventh(intervals);

  const majorSixth = Intervals.sixth(intervals);
  const majorNinth = Intervals.ninth(intervals);
  const perfectEleventh = Intervals.eleventh(intervals);
  const majorThirteenth = Intervals.thirteenth(intervals);

  if (triadType === TriadType.AUGMENTED) {
    if (minorSeventh) {
      return 'aug7'
    }
    return triadType;
  }

  if (triadType === TriadType.DIMINISHED) {
    if (majorSixth) {
      return 'dim7';
    }
    else if (minorSeventh) {
      return 'm7b5';
    }
    return triadType;
  }

  if (triadType === TriadType.MAJOR) {
    if (minorSeventh) {
      if (isThirteenthChord(intervals)) {
        return '13';
      }
      if (isEleventhChord(intervals)) {
        return '11';
      }
      if (Intervals.ninth(intervals)) {
        return '9'
      }
      return '7';
    }
    else if (majorSeventh) {
      console.log('Found Major Seventh')
      if (isThirteenthChord(intervals)) {
        return 'maj13';
      }
      if (isEleventhChord(intervals)) {
        return 'maj11';
      }
      if (Intervals.sharpEleventh(intervals)) {
        return 'maj7#11'
      }
      if (Intervals.ninth(intervals)) {
        return 'maj9'
      }
      return 'maj7';
    }
    else if (majorSixth || majorThirteenth) {
      return '6';
    } else {
      if (majorThirteenth) {
        return 'add13';
      }
      if (perfectEleventh) {
        return 'add11';
      }
      if (majorNinth) {
        return 'add9';
      }
      if (Intervals.second(intervals)) {
        return 'add2';
      }
    }
  }

  if (triadType === TriadType.MINOR) {
    if (minorSeventh) {
      if (isThirteenthChord(intervals)) {
        return 'min13';
      }
      if (isEleventhChord(intervals)) {
        return 'min11';
      }
      if (Intervals.ninth(intervals)) {
        return 'min9'
      }
      return 'min7';
    }
    if (majorSixth || majorThirteenth) {
      return 'min6';
    }
  }

  if (triadType === TriadType.SUSPENDED_SECOND || triadType === TriadType.SUSPENDED_FOURTH) {
    if (minorSeventh) {  // All Dominant chords
      let dominantCode = '7';
      if (majorThirteenth) {
        dominantCode = '13'
      } else if (perfectEleventh) {
        dominantCode = '11'
      } else if (majorNinth) {
        dominantCode = '9'
      }

      if (Intervals.sharpEleventh(intervals)) {
        return `${dominantCode}${triadType}#11`
      }
      if (Intervals.minorThirteenth(intervals)) {
        return `${dominantCode}${triadType}b13`
      }
      if (Intervals.minorNinth(intervals)) {
        return `${dominantCode}${triadType}b9`
      }
      if (Intervals.sharpNinth(intervals)) {
        return `${dominantCode}${triadType}#9`
      }
      return `${dominantCode}${triadType}`;
    }
  }

  const fifth = Intervals.fifth(intervals);
  // Check if fifth is excluded from a major or minor chord
  if (!triadType && !fifth) {
    if (majorThird) {
      // maj7/9/11/13 Chords
      if (majorSeventh) {
        if (majorThirteenth && !isThirteenthChord(intervals)) {
          return 'maj13';
        }
        if (perfectEleventh && !isEleventhChord(intervals)) {
          return 'maj11';
        }
        if (Intervals.sharpEleventh(intervals)) {
          return 'maj7#11'
        }
        if (majorNinth) {
          return 'maj9'
        }
        return 'maj7';
      } else if (minorSeventh) {  // All Dominant chords
        let dominantCode = '7';
        if (majorThirteenth) {
          dominantCode = '13'
        } else if (perfectEleventh) {
          dominantCode = '11'
        } else if (majorNinth) {
          dominantCode = '9'
        }

        if (Intervals.sharpEleventh(intervals)) {
          return `${dominantCode}#11`
        }
        if (Intervals.minorThirteenth(intervals)) {
          return `${dominantCode}b13`
        }
        if (Intervals.minorNinth(intervals)) {
          return `${dominantCode}b9`
        }
        if (Intervals.sharpNinth(intervals)) {
          return `${dominantCode}#9`
        }
        return dominantCode;
      } else if (majorSixth) {
        return '6';
      }
    }
    if (minorThird) {
      if (minorSeventh) {
        if (majorThirteenth && !isThirteenthChord(intervals)) {
          return 'min7add13'
        }
        if (perfectEleventh && !isEleventhChord(intervals)) {
          return 'min7add11'
        }
        if (majorNinth) {
          return 'min9'
        }
        return 'min7';
      }
      if (majorSixth || majorThirteenth) {
        return 'min6';
      }
    }
  }

  return triadType || '?';
}

export const deriveChordNameFromNotes = (notes = [], tonic = null) => {
  const root = tonic || notes[0];
  const intervals = uniq(getHarmonicIntervalsOfNotes(notes, root).map((interval) => normalizeIntervalToTwoOctaves(interval)))
  const chordType = deriveExtensionFromIntervals(intervals);

  const lowestNoteDifferent = notes[0].replace(/\d/g, '') !== root.replace(/\d/g, '') && tonic !== null;

  const slashSuffix = lowestNoteDifferent ? ` / ${notes[0].replace(/\d/g, '')}` : '';
  return `${root.replace(/\d/g, '')}${chordType}${slashSuffix}`;
}

export const getPossibleNamesOfChordByNotes = (notes = []) => {
  return notes.map(note => deriveChordNameFromNotes(notes, note)).filter((str) => !str.includes('?'));
}