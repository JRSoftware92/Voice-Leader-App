import type { Scale } from "../../types/Scale.ts";

import ScaleListItem from "./ScaleListItem.tsx";

export const ScaleList = ({ onClick, onDelete, selectedScaleName, scales = [], startNotes = [] }) => {
    return (
        <div className="p-4 m-2 grid grid-cols-4 gap-4 overflow-y-auto max-h-96">
            {
                scales?.map((scale: Scale) => (
                    <ScaleListItem
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

export default ScaleList;
