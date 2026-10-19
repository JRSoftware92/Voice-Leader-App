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

const isThirteenthChord = (intervals, major = true) => {
  return Intervals.thirteenth(intervals) && isEleventhChord(intervals);
}

const isEleventhChord = (intervals, major = true) => {
  return Intervals.ninth(intervals) && (Intervals.eleventh(intervals) || (major && Intervals.sharpEleventh(intervals)));
}

export const deriveExtensionFromIntervals = (intervals = []) => {
  const triadType = deriveTriadTypeByIntervals(intervals);

  const majorThird = Intervals.third(intervals);
  const minorThird = Intervals.minorThird(intervals);
  const majorSeventh = Intervals.third(intervals);
  const minorSeventh = Intervals.minorSeventh(intervals);

  const majorSecond = Intervals.second(intervals);
  const majorSixth = Intervals.sixth(intervals);
  const minorSixth = Intervals.minorSixth(intervals);

  const majorNinth = Intervals.ninth(intervals);
  const perfectEleventh = Intervals.eleventh(intervals);
  const majorThirteenth = Intervals.thirteenth(intervals);

  const fourth = Intervals.fourth(intervals);
  const fifth = Intervals.fifth(intervals);
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
    if (majorSeventh) {
      if (isThirteenthChord(intervals)) {
        return 'maj13';
      }
      if (isEleventhChord(intervals)) {
        return 'maj11';
      }
      if (Intervals.ninth(intervals)) {
        return 'maj9'
      }
      return 'maj7';
    }
    if (majorSixth) {
      return 'maj6';
    }
  }

  if (triadType === TriadType.MINOR) {
    if (minorSeventh) {
      if (isThirteenthChord(intervals, false)) {
        return 'min13';
      }
      if (isEleventhChord(intervals, false)) {
        return 'min11';
      }
      if (Intervals.ninth(intervals)) {
        return 'min9'
      }
      return 'min7';
    }
    if (majorSixth) {
      return 'min6';
    }
  }

  // Check if fifth is excluded from a major or minor chord
  if (!triadType && !fifth) {
    if (majorThird && majorSeventh) {
      if (majorThirteenth && !isThirteenthChord(intervals)) {
        return 'maj7add13'
      }
      if (perfectEleventh && !isEleventhChord(intervals)) {
        return 'maj7add11'
      }
      if (majorNinth) {
        return 'maj9'
      }
      return 'maj7';
    }
    if (minorThird && minorSeventh) {
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
    if (majorThird && minorSeventh) {
      if (majorThirteenth) {
        return '13'
      }
      if (perfectEleventh) {
        return '11'
      }
      if (majorNinth) {
        return '9'
      }
      if (Intervals.altered(intervals)) {
        return '7alt';
      }
      return '7';
    }
  }

  return triadType || '?';
}

export const deriveChordNameFromNotes = (notes = [], tonic = null) => {
  const root = tonic || notes[0];
  const intervals = uniq(getHarmonicIntervalsOfNotes(notes, root).map((interval) => normalizeIntervalToTwoOctaves(interval)))
  // console.log('Intervals', intervals);
  const chordType = deriveExtensionFromIntervals(intervals);

  const lowestNoteDifferent = notes[0] !== root && tonic !== null;

  const slashSuffix = lowestNoteDifferent ? ` / ${notes[0].replace(/\d/g, '')}` : '';
  return `${root.replace(/\d/g, '')}${chordType}${slashSuffix}`;
}

export const getPossibleNamesOfChordByNotes = (notes = []) => {
  return notes.map(note => deriveChordNameFromNotes(notes, note)).filter((str) => !str.includes('?'));
}