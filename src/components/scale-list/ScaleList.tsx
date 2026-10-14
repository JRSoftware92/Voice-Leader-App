import type { Scale } from "../../types/Scale.ts";

import ScaleListItem from "./ScaleListItem.tsx";

export const ScaleList = ({ scales = [], startNotes = [] }) => {
    return (
        <div className="p-4 m-2 grid grid-cols-4 gap-4 overflow-y-auto max-h-96">
            {
                scales?.map((scale: Scale) => (
                    <ScaleListItem
                        key={scale.name}
                        name={scale.name}
                        notes={scale.notes}
                        startNotes={startNotes}
                    />
                ))
            }
        </div>
    )
}

export default ScaleList;
