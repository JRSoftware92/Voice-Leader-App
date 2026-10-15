import { useMemo } from 'react';

import { Interval } from 'tonal';

import ChordListItem from "./ChordListItem.tsx";

import type { Chord } from "../../types/Chord.ts";
import type { Scale } from "../../types/Scale.ts";

import { getRelativeScaleDegree } from "../../voice-leading/identify-scales";

type ChordListProps = {
    rootChord?: Chord,
    scale?: Scale | undefined,
    chords?: Chord[],
}

type ChordWithScaleDegrees = Chord & {
    relativeScaleDegree: number,
}

const addScaleDegreeToChord = (chord: Chord, tonic: string): ChordWithScaleDegrees[] => {
    const chordRoot = chord.tonic;
    const scaleDegree = getRelativeScaleDegree(tonic, chordRoot);
    return ({
        ...chord,
        relativeScaleDegree: scaleDegree
    })
}

export const ChordList = ({ rootChord, scale, chords = [] }: ChordListProps) => {
    const startNotes = rootChord?.notes || [];
    const tonicNote: string | undefined = scale?.tonic;
    const chordsWithScaleDegrees: ChordWithScaleDegrees[] = useMemo(() => {
        if (!tonicNote) {
            return chords;
        }
        return chords.map((chord) => addScaleDegreeToChord(chord, tonicNote));
    }, [tonicNote, chords])
    return (
        <div className="p-4 m-2 grid grid-cols-4 gap-4 overflow-y-auto max-h-96">
            {
                chordsWithScaleDegrees?.map((chord: ChordWithScaleDegrees) => (
                    <ChordListItem
                        key={chord.symbol}
                        name={chord.symbol}
                        degrees={chord.degrees}
                        notes={chord.notes}
                        scaleDegree={chord.relativeScaleDegree}
                        startNotes={startNotes}
                    />
                ))
            }
        </div>
    )
}

export default ChordList;
