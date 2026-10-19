import { Interval } from 'tonal';

export const getHarmonicIntervalsOfNotes = (notes = [], tonic = null) => {
  const root = tonic || notes[0];
  return notes.map(note => Interval.distance(root, note));
}

// Bounds interval measurements to two octave range
export const normalizeIntervalToTwoOctaves = (intervalName) => {
  const ivl = Interval.get(intervalName);
  if (ivl.empty) return null; // Invalid interval

  // Get total semitones and use modulo 24 (2 octaves = 24 semitones)
  // Handle negative intervals (descending) correctly with a positive modulo
  let semitones = ivl.semitones % 24;
  if (semitones < 0) semitones += 24;

  // Re-generate the interval name from semitones
  // Note: fromSemitones defaults to major/perfect qualities
  let normalized = Interval.fromSemitones(semitones);

  // If the original interval was an octave/double octave boundary,
  // ensure it maps correctly if 0 semitones needs to stay 2 octaves.
  if (semitones === 0 && ivl.semitones >= 24) {
    return "8P"; // Double octave
  }

  return normalized;
}

// Interval Identification, normalized for algorithmic derivation of chord names
const hasMajorThird = intervals => intervals.includes('3M') || intervals.includes('10M');
const hasMinorThird = intervals => intervals.includes('3m') || intervals.includes('10m');
const hasMajorSeventh = intervals => intervals.includes('7M') || intervals.includes('14M')
const hasMinorSeventh = intervals => intervals.includes('7m') || intervals.includes('14m')

const hasRoot = intervals => intervals.includes('1P') || intervals.includes('8P') || intervals.includes('15P')
const hasPerfectFifth = intervals => intervals.includes('5P') || intervals.includes('12P')

const hasAugmentedFifth = intervals => intervals.includes('6m');
const hasMinorSixth = intervals => hasAugmentedFifth(intervals);

const hasDiminishedFifth = intervals => intervals.includes('5d');
const hasSharpEleventh = intervals => intervals.includes('12d');
const hasMinorThirteen = intervals => intervals.includes('13m');
const hasMajorSecond = intervals => intervals.includes('2M');
const hasMajorNinth = intervals => intervals.includes('9M');
const hasSharpNinth = intervals => intervals.includes('10m');
const hasPerfectFourth = intervals => intervals.includes('4P');
const hasEleventh = intervals => intervals.includes('11P');

const hasMajorSixth = intervals => intervals.includes('6M');
const hasMajorThirteenth = intervals => intervals.includes('13M');

const hasMinorSecond = intervals => intervals.includes('2m');
const hasMinorNinth = intervals => intervals.includes('9m');

const hasAlteredDegree = intervals => hasSharpEleventh(intervals) || hasMinorThirteen(intervals) || hasMinorNinth(intervals) || hasSharpNinth(intervals);

export const INTERVAL_CHECKER = {
  root: hasRoot,
  third: hasMajorThird,
  minorThird: hasMinorThird,
  minorSeventh: hasMinorSeventh,
  seventh: hasMajorSeventh,
  fifth: hasPerfectFifth,
  dimFifth: hasDiminishedFifth,
  augFifth: hasAugmentedFifth,
  minorSixth: hasMinorSixth,
  second: hasMajorSecond,
  minorSecond: hasMinorSecond,
  ninth: hasMajorNinth,
  minorNinth: hasMinorNinth,
  fourth: hasPerfectFourth,
  eleventh: hasEleventh,
  sixth: hasMajorSixth,
  thirteenth: hasMajorThirteenth,
  sharpEleventh: hasSharpEleventh,
  sharpNinth: hasSharpNinth,
  minorThirteenth: hasMinorThirteen,
  altered: hasAlteredDegree,
}

