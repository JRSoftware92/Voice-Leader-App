import classNames from "classnames";

type ScaleListItemProps = {
    name: string,
    degrees?: string[],
    notes?: string[],
    startNotes?: string[],
}

const OverlapList = ({ notes = [], startNotes = []}) => {
    return (
        <div className="flex justify-center items-center">
            {
                notes.map((note, index) => (
                    <span className={classNames('mx-1', { 'text-red-500': startNotes[index] === note} )}>{note}</span>
                ))
            }
        </div>
    )
}

export const ScaleListItem = ({ name, notes = [], startNotes = [] }: ScaleListItemProps) => {
    return (
        <div className="p-4 m-2 flex flex-col justify-center items-center border border-solid rounded-sm">
            <span className="font-bold">{name}</span>
            <OverlapList notes={notes} startNotes={startNotes} />
        </div>
    )
}

export default ScaleListItem;
