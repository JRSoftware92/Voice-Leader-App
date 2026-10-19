import type { Scale } from "../../types/Scale.ts";

import ChordScaleListItem from "./ChordScaleListItem.tsx";

// TODO - Show a list of scales that can be played over a given chord for each chord in a list
export const ChordScaleList = ({ onClick, onDelete, selectedScaleName, scales = [], startNotes = [] }) => {
    return (
        <div className="p-4 m-2 grid grid-cols-4 gap-4 overflow-y-auto max-h-96">
            {
                scales?.map((scale: Scale) => (
                    <ChordScaleListItem
                        scale={scale}
                        key={scale.name}
                        name={scale.name}
                        notes={scale.notes}
                        startNotes={startNotes}
                        onClick={onClick}
                        onDelete={onDelete}
                        selected={selectedScaleName && scale.name === selectedScaleName}
                    />
                ))
            }
        </div>
    )
}

export default ChordScaleList;
