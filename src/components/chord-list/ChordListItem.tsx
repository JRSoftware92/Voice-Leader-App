import difference from "lodash/difference";
import classNames from "classnames";

type ChordListItemProps = {
    name: string,
    degrees?: string[],
    notes?: string[],
    startNotes?: string[],
}

const OverlapList = ({ notes = [], newNotes = []}) => {
    return (
        <div className="flex justify-center items-center">
            {
                notes.map((note) => (
                    <span className={classNames('mx-1', { 'text-red-500': newNotes?.includes(note)} )}>{note}</span>
                ))
            }
        </div>
    )
}

export const ChordListItem = ({ name, degrees = [], notes = [], startNotes = [] }: ChordListItemProps) => {
    const diff = difference(notes, startNotes);
    return (
        <div className="p-4 m-2 flex flex-col justify-center items-center border border-solid rounded-sm">
            <span className="font-bold">{name}</span>
            <span>{degrees?.join(', ')}</span>
            <OverlapList notes={notes} newNotes={diff} />
        </div>
    )
}

export default ChordListItem;
