import { ScrollArea } from "../ui/scroll-area.tsx";
import { Separator } from "../ui/separator.tsx";

import NoteList from "../note-list/NoteList.tsx";
import {getDistanceBetweenTonicNotes} from "../../voice-leading/identify-chords";

const TransformationItem = ({ item }) => {
    return (
        <li
            key={item.chord}
            className="flex px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground items-center"
        >
            <span className="m-1 p-1 min-w-1/4 font-bold">
                {item.chord}
            </span>
            <div className="flex flex-col">
                <span className="text-sm text-gray-600">
                    {item.label}
                </span>
                <div className="flex justify-between items-center">
                    <NoteList notes={item.prevChordInfo.notes} />
                    <span>{'--->'}</span>
                    <NoteList notes={item.notes} />
                </div>
            </div>
        </li>
    )
}

export const ChordTransformationList = ({
    transformations = [],
}) => {
    const sortedTransformations = transformations.sort((a, b) => {
        return a.distance - b.distance;
    });

    // Group items by category
    const groupedTransformations = sortedTransformations.reduce((acc, item) => {
        if (item?.type) {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            const itemCheckArr = acc[item.type];
            const sameSymbol = itemCheckArr.find((itemCheck) => itemCheck.symbol === item.symbol);
            if (!sameSymbol) {
                acc[item.type].push(item);
            }
        }
        return acc;
    }, {} as Record<string, object[]>);

    return (
        <ScrollArea className="h-[420px] w-2/3 rounded-md border p-4">
            <div className="space-y-4">
                {Object.entries(groupedTransformations).map(([category, groupItems], index) => (
                    <div key={category}>
                        <h4 className="mb-2 text-sm font-semibold leading-none tracking-tight text-muted-foreground">
                            {category}
                        </h4>
                        <ul className="space-y-1">
                            {groupItems.map((item) => (
                                <TransformationItem key={item.symbol} item={item} />
                            ))}
                        </ul>
                        {index < Object.entries(groupedTransformations).length - 1 && (
                            <Separator className="my-3" />
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}

export default ChordTransformationList;
