import { useMemo } from 'react';

import ChordListItem from "./ChordListItem.tsx";

import type { Chord } from "../../types/Chord.ts";
import type { Scale as ScaleType } from "../../types/Scale.ts";

import { getRomanScaleDegree } from "../../voice-leading/identify-scales";

type ChordListProps = {
    onClick?: (chord: Chord) => void,
    rootChord?: Chord,
    scale?: ScaleType | undefined,
    chords?: Chord[],
}

type ChordWithScaleDegrees = Chord & {
    romanDegree: string,
}

const addScaleDegreeToChord = (chord: Chord, tonic: string): ChordWithScaleDegrees[] => {
    const chordRoot = chord.tonic;
    return ({
        ...chord,
        romanDegree: getRomanScaleDegree(tonic, chordRoot),
    })
}

export const ChordList = ({ rootChord, scale, onClick, chords = [] }: ChordListProps) => {
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
                        chord={chord}
                        key={chord.symbol}
                        name={chord.symbol}
                        degrees={chord.degrees}
                        notes={chord.notes}
                        scaleDegree={chord.romanDegree}
                        startNotes={startNotes}
                        onClick={onClick}
                    />
                ))
            }
        </div>
    )
}

export default ChordList;
