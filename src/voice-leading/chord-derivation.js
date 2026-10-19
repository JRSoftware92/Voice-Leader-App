import uniq from 'lodash/uniq';

import {getHarmonicIntervalsOfNotes, normalizeIntervalToTwoOctaves } from "./identify-intervals.js";
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
    return ChordType.DIMINISHED;
  }
  if (fifth) {
    if (majorThird) {
      if (minorSeventh) {
        return ChordType.DOMINANT;
      }
      return ChordType.MAJOR;
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

  return '';
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

const getAlterationsForChord = (intervals) => {
  if (Intervals.sharpNinth(intervals)) {
    return '#9';
  }
  if (Intervals.minorNinth(intervals)) {
    return 'b9'
  }
  if (Intervals.sharpEleventh(intervals)) {
    return '#11';
  }
  if (Intervals.minorThirteenth(intervals)) {
    return 'b13';
  }
  return '';
}

const getAugmentationsForChord = (intervals, exclude = []) => {
  if (Intervals.thirteenth(intervals) && !exclude.includes('13')) {
    return 'add13';
  }
  if (Intervals.eleventh(intervals) && !exclude.includes('11')) {
    return 'add11';
  }
  if (Intervals.ninth(intervals) && !exclude.includes('9')) {
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
      return extension;
    }
  }
  if (chordType === ChordType.SUSPENDED_SECOND || chordType === ChordType.SUSPENDED_FOURTH) {
    return `${extension}${chordType}`;
  }
  if (chordType === ChordType.AUGMENTED || chordType === ChordType.DIMINISHED) {
    if (extension !== '7') {
      return chordType;
    }
  }
  if (chordType === ChordType.DOMINANT) {
    return extension;
  }

  return `${chordType}${extension}`;
}

export const simplifyAlterationsAndAugmentations = (chordType, alteration, augmentation) => {
  return chordType === ChordType.DOMINANT ? `${alteration}${augmentation}` : augmentation;
}

export const deriveTypeFromIntervals = (intervals) => {
  const chordType = getTypeOfChord(intervals);
  const extension = getExtensionForChord(intervals);
  const alteration = getAlterationsForChord(intervals);
  const augmentation = getAugmentationsForChord(intervals, [extension, alteration]);

  const simplifiedType = simplifyTypeAndExtension(chordType, extension);
  const simplifiedAdditions = simplifyAlterationsAndAugmentations(chordType, alteration, augmentation)

  // console.groupCollapsed('Type from Intervals');
  // console.log('Intervals', intervals);
  // console.log('Type', chordType);
  // console.log('Extension', extension);
  // console.log('Alteration', alteration);
  // console.log('Augmentation', augmentation);
  // console.log('Simple Type', simplifiedType);
  // console.log('Extras', simplifiedAdditions)
  // console.groupEnd();

  return `${simplifiedType}${simplifiedAdditions}`;
}

export const deriveChordNameFromNotes = (notes = [], tonic = null) => {
  const root = tonic || notes[0];
  const intervals = uniq(getHarmonicIntervalsOfNotes(notes, root).map((interval) => normalizeIntervalToTwoOctaves(interval)))
  const chordType = deriveTypeFromIntervals(intervals);

  const lowestNoteDifferent = notes[0].replace(/\d/g, '') !== root.replace(/\d/g, '') && tonic !== null;

  const slashSuffix = lowestNoteDifferent ? ` / ${notes[0].replace(/\d/g, '')}` : '';
  return `${root.replace(/\d/g, '')}${chordType}${slashSuffix}`;
}

export const getPossibleNamesOfChordByNotes = (notes = []) => {
  return notes.map(note => deriveChordNameFromNotes(notes, note)).filter((str) => !str.includes('?'));
}

// export const oldDeriveExtensionFromIntervals = (intervals = []) => {
//   const triadType = deriveTriadTypeByIntervals(intervals);
//
//   const majorThird = Intervals.third(intervals);
//   const minorThird = Intervals.minorThird(intervals);
//   const majorSeventh = Intervals.seventh(intervals);
//   const minorSeventh = Intervals.minorSeventh(intervals);
//
//   const majorSixth = Intervals.sixth(intervals);
//   const majorNinth = Intervals.ninth(intervals);
//   const perfectEleventh = Intervals.eleventh(intervals);
//   const majorThirteenth = Intervals.thirteenth(intervals);
//
//   if (triadType === ChordType.AUGMENTED) {
//     if (minorSeventh) {
//       return 'aug7'
//     }
//     return triadType;
//   }
//
//   if (triadType === ChordType.DIMINISHED) {
//     if (majorSixth) {
//       return 'dim7';
//     }
//     else if (minorSeventh) {
//       return 'm7b5';
//     }
//     return triadType;
//   }
//
//   if (triadType === ChordType.MAJOR) {
//     if (minorSeventh) {
//       if (isThirteenthChord(intervals)) {
//         return '13';
//       }
//       if (isEleventhChord(intervals)) {
//         return '11';
//       }
//       if (Intervals.ninth(intervals)) {
//         return '9'
//       }
//       return '7';
//     }
//     else if (majorSeventh) {
//       if (isThirteenthChord(intervals)) {
//         return 'maj13';
//       }
//       if (isEleventhChord(intervals)) {
//         return 'maj11';
//       }
//       if (Intervals.sharpEleventh(intervals)) {
//         return 'maj7#11'
//       }
//       if (Intervals.ninth(intervals)) {
//         return 'maj9'
//       }
//       return 'maj7';
//     }
//     else if (majorSixth || majorThirteenth) {
//       return '6';
//     } else {
//       if (majorThirteenth) {
//         return 'add13';
//       }
//       if (perfectEleventh) {
//         return 'add11';
//       }
//       if (majorNinth) {
//         return 'add9';
//       }
//       if (Intervals.second(intervals)) {
//         return 'add2';
//       }
//     }
//   }
//
//   if (triadType === ChordType.MINOR) {
//     if (minorSeventh) {
//       if (isThirteenthChord(intervals)) {
//         return 'min13';
//       }
//       if (isEleventhChord(intervals)) {
//         return 'min11';
//       }
//       if (Intervals.ninth(intervals)) {
//         return 'min9'
//       }
//       return 'min7';
//     }
//     if (majorSixth || majorThirteenth) {
//       return 'min6';
//     }
//   }
//
//   if (triadType === ChordType.SUSPENDED_SECOND || triadType === ChordType.SUSPENDED_FOURTH) {
//     if (minorSeventh) {  // All Dominant chords
//       let dominantCode = '7';
//       if (majorThirteenth) {
//         dominantCode = '13'
//       } else if (perfectEleventh) {
//         dominantCode = '11'
//       } else if (majorNinth) {
//         dominantCode = '9'
//       }
//
//       if (Intervals.sharpEleventh(intervals)) {
//         return `${dominantCode}${triadType}#11`
//       }
//       if (Intervals.minorThirteenth(intervals)) {
//         return `${dominantCode}${triadType}b13`
//       }
//       if (Intervals.minorNinth(intervals)) {
//         return `${dominantCode}${triadType}b9`
//       }
//       if (Intervals.sharpNinth(intervals)) {
//         return `${dominantCode}${triadType}#9`
//       }
//       return `${dominantCode}${triadType}`;
//     }
//   }
//
//   const fifth = Intervals.fifth(intervals);
//   // Check if fifth is excluded from a major or minor chord
//   if (!triadType && !fifth) {
//     if (majorThird) {
//       // maj7/9/11/13 Chords
//       if (majorSeventh) {
//         if (majorThirteenth && !isThirteenthChord(intervals)) {
//           return 'maj13';
//         }
//         if (perfectEleventh && !isEleventhChord(intervals)) {
//           return 'maj11';
//         }
//         if (Intervals.sharpEleventh(intervals)) {
//           return 'maj7#11'
//         }
//         if (majorNinth) {
//           return 'maj9'
//         }
//         return 'maj7';
//       } else if (minorSeventh) {  // All Dominant chords
//         let dominantCode = '7';
//         if (majorThirteenth) {
//           dominantCode = '13'
//         } else if (perfectEleventh) {
//           dominantCode = '11'
//         } else if (majorNinth) {
//           dominantCode = '9'
//         }
//
//         if (Intervals.sharpEleventh(intervals)) {
//           return `${dominantCode}#11`
//         }
//         if (Intervals.minorThirteenth(intervals)) {
//           return `${dominantCode}b13`
//         }
//         if (Intervals.minorNinth(intervals)) {
//           return `${dominantCode}b9`
//         }
//         if (Intervals.sharpNinth(intervals)) {
//           return `${dominantCode}#9`
//         }
//         return dominantCode;
//       } else if (majorSixth) {
//         return '6';
//       }
//     }
//     if (minorThird) {
//       if (minorSeventh) {
//         if (majorThirteenth && !isThirteenthChord(intervals)) {
//           return 'min7add13'
//         }
//         if (perfectEleventh && !isEleventhChord(intervals)) {
//           return 'min7add11'
//         }
//         if (majorNinth) {
//           return 'min9'
//         }
//         return 'min7';
//       }
//       if (majorSixth || majorThirteenth) {
//         return 'min6';
//       }
//     }
//   }
//
//   return triadType || '?';
// }