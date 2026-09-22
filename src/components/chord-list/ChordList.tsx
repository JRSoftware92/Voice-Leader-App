import ChordListItem from "./ChordListItem.tsx";

import type { Chord } from "../../types/Chord.ts";

export const ChordList = ({ chords = [] }) => {
    return (
        <div className="p-4 m-2 grid grid-cols-4 gap-4">
            {
                chords?.map((chord: Chord) => (
                    <ChordListItem
                        key={chord.symbol}
                        name={chord.symbol}
                        degrees={chord.degrees}
                        notes={chord.notes}
                    />
                ))
            }
        </div>
    )
}

export default ChordList;
