import ChordListItem from "./ChordListItem.tsx";

import type { Chord } from "../../types/Chord.ts";

export const ChordList = ({ rootChord, chords = [] }) => {
    const startNotes = rootChord?.notes || [];
    return (
        <div className="p-4 m-2 grid grid-cols-4 gap-4 overflow-y-auto max-h-96">
            {
                chords?.map((chord: Chord) => (
                    <ChordListItem
                        key={chord.symbol}
                        name={chord.symbol}
                        degrees={chord.degrees}
                        notes={chord.notes}
                        startNotes={startNotes}
                    />
                ))
            }
        </div>
    )
}

export default ChordList;
