import uniq from 'lodash/uniq';

import {
  convertIntervalsToScaleDegrees,
  getHarmonicIntervalsOfNotes, intervalToDegree,
  normalizeIntervalToTwoOctaves
} from "./identify-intervals.js";
import {ChordType} from "../types/Chord.ts";

import { INTERVAL_CHECKER as Intervals } from "./identify-intervals.js";

const getTypeOfChord = (intervals) => {
  const majorThird = Intervals.third(intervals);
  const minorThird = Intervals.minorThird(intervals);
  const majorSecond = Intervals.second(intervals);
  const fourth = Intervals.fourth(intervals);

  const majorSeventh = Intervals.seventh(intervals);
  const minorSeventh = Intervals.minorSeventh(intervals);

  const fifth = Intervals.fifth(intervals);
  const augmentedFifth = Intervals.augFifth(intervals);
  const diminishedFifth = Intervals.dimFifth(intervals);

  if (augmentedFifth && majorThird) {
    return ChordType.AUGMENTED;
  }
  if (diminishedFifth && minorThird) {
    if (minorSeventh) {
      return ChordType.HALF_DIMINISHED;
    }
    return ChordType.DIMINISHED;
  }
  if (fifth) {
    if (majorThird) {
      if (majorSeventh || !minorSeventh) {
        return ChordType.MAJOR;
      } else if (minorSeventh) {
        return ChordType.DOMINANT;
      }
    }
    if (minorThird) {
      if (majorSeventh) {
        return ChordType.MAJOR_MINOR;
      }
      return ChordType.MINOR;
    }
    if (majorSecond) {
      return ChordType.SUSPENDED_SECOND;
    }
    if (fourth) {
      return ChordType.SUSPENDED_FOURTH;
    }
  } else {
    if (majorThird && majorSeventh) {
      return ChordType.MAJOR;
    }
    if (minorThird && minorSeventh) {
      return ChordType.MINOR;
    }
    if (majorThird && minorSeventh) {
      return ChordType.DOMINANT;
    }
    if (minorThird && majorSeventh) {
      return ChordType.MAJOR_MINOR;
    }
  }

  return '?';
}

const getExtensionForChord = (intervals) => {
  if (Intervals.seventh(intervals) || Intervals.minorSeventh(intervals)) {
    if (Intervals.thirteenth(intervals)) {
      return '13'
    }
    if (Intervals.eleventh(intervals)) {
      return '11';
    }
    if (Intervals.ninth(intervals)) {
      return '9';
    }
    return '7';
  }
  if (Intervals.sixth(intervals)) {
    return '6';
  }
  return '';
}

const getAlterationsForChord = (intervals, exclude = []) => {
  if (Intervals.sharpNinth(intervals) && !exclude.includes('#9')) {
    return '#9';
  }
  if (Intervals.minorNinth(intervals) && !exclude.includes('b9')) {
    return 'b9'
  }
  if (Intervals.sharpEleventh(intervals) && !exclude.includes('#11')) {
    return '#11';
  }
  if (Intervals.sharpThirteenth(intervals) && !exclude.includes('#13')) {
    return 'b13';
  }
  if (Intervals.minorThirteenth(intervals) && !exclude.includes('b13')) {
    return 'b13';
  }
  if (Intervals.augFifth(intervals) && !exclude.includes('#5')) {
    return '#5';
  }
  if (Intervals.dimFifth(intervals) && !exclude.includes('b5')) {
    return '#4';
  }
  return '';
}

const getAugmentationsForChord = (intervals, exclude = []) => {
  if (Intervals.thirteenth(intervals) && !exclude.includes('13')) {
    return 'add13';
  }
  if (Intervals.eleventh(intervals) && !exclude.includes('11') && !exclude.includes('13')) {
    return 'add11';
  }
  if (Intervals.ninth(intervals) && !exclude.includes('9') && !exclude.includes('11') && !exclude.includes('13')) {
    return 'add9';
  }
  if (Intervals.sixth(intervals) && !exclude.includes('6')) {
    return 'add6';
  }
  if (Intervals.fourth(intervals) && !exclude.includes('4')) {
    return 'add4';
  }
  if (Intervals.second(intervals) && !exclude.includes('2')) {
    return 'add2';
  }
  return '';
}

const simplifyTypeAndExtension = (chordType, extension) => {
  if (chordType === ChordType.MAJOR) {
    if (extension === '6') {
      return '6';
    }
  }
  if (chordType === ChordType.SUSPENDED_SECOND || chordType === ChordType.SUSPENDED_FOURTH) {
    return `${extension}${chordType}`;
  }
  if (chordType === ChordType.HALF_DIMINISHED) {
    return chordType;
  }
  if (chordType === ChordType.AUGMENTED) {
    if (extension?.length && extension !== '6') {
      return `${extension}#5`;
    }
    return chordType;
  }
  if (chordType === ChordType.DIMINISHED) {
    if (extension !== '7') {
      return chordType;
    }
  }
  if (chordType === ChordType.DOMINANT) {
    return extension;
  }

  return `${chordType}${extension}`;
}

export const simplifyAlterationsAndAugmentations = (chordType, fullTypeString, alteration, augmentation) => {
  if (chordType === ChordType.SUSPENDED_SECOND || chordType === ChordType.SUSPENDED_FOURTH || chordType === ChordType.MAJOR) {
    return `${alteration}${augmentation}`;
  }
  if (chordType === ChordType.DOMINANT) {
    return alteration;
  }

  return `${augmentation}`;
}

export const deriveTypeFromIntervals = (intervals) => {
  const chordType = getTypeOfChord(intervals);
  const extension = getExtensionForChord(intervals);

  const bassDegree = intervalToDegree(intervals[0]);
  const alteration = getAlterationsForChord(intervals, [extension, bassDegree]);
  const augmentation = getAugmentationsForChord(intervals, [extension, alteration, bassDegree]);

  const simplifiedType = simplifyTypeAndExtension(chordType, extension);
  const simplifiedAdditions = simplifyAlterationsAndAugmentations(chordType, extension, alteration, augmentation)

  return `${simplifiedType}${simplifiedAdditions}`;
}

export const deriveChordFromNotes = (notes = [], tonic = null) => {
  const root = tonic || notes[0];
  const harmonicIntervals = getHarmonicIntervalsOfNotes(notes, root);
  const normalizedIntervals = harmonicIntervals.map((interval) => normalizeIntervalToTwoOctaves(interval));
  const intervals = uniq(normalizedIntervals);
  const chordType = deriveTypeFromIntervals(intervals, notes[0]);

  const lowestNoteDifferent = notes[0].replace(/\d/g, '') !== root.replace(/\d/g, '') && tonic !== null;

  const slashSuffix = lowestNoteDifferent ? ` / ${notes[0].replace(/\d/g, '')}` : '';
  const name = `${root.replace(/\d/g, '')}${chordType}${slashSuffix}`;
  return {
    unknown: name.includes('?'),
    name,
    symbol: name,
    root,
    tonic: root,
    bass: notes[0],
    type: chordType,
    notes,
    intervals,
    degrees: convertIntervalsToScaleDegrees(intervals),
  };
}

export const getPossibleChordsByNotes = (notes = []) => {
  return notes.map(note => deriveChordFromNotes(notes, note)).filter((chord) => !chord.unknown);
}
