import { ScrollArea } from "../../ui/scroll-area";
import { Separator } from "../../ui/separator";

export const ChordTransformationList = ({
    transformations = [],
}) => {
    // Group items by category
    const groupedTransformations = transformations.reduce((acc, item) => {
        if (!acc[item.group]) {
            acc[item.group] = [];
        }
        acc[item.group].push(item);
        return acc;
    }, {} as Record<string, object[]>);

    return (
        <ScrollArea className="h-[300px] w-[250px] rounded-md border p-4">
            <div className="space-y-4">
                {Object.entries(groupedTransformations).map(([category, groupItems], index) => (
                    <div key={category}>
                        <h4 className="mb-2 text-sm font-semibold leading-none tracking-tight text-muted-foreground">
                            {category}
                        </h4>
                        <ul className="space-y-1">
                            {groupItems.map((item) => (
                                <li
                                    key={item.chord}
                                    className="rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    {item.chord} ({item.notes.join(', ')})
                                </li>
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
