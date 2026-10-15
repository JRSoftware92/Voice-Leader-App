import classNames from "classnames";

import type {Scale} from "../../types/Scale.ts";

type ChordListItemProps = {
    name: string,
    scaleDegree: number,
    degrees?: string[],
    notes?: string[],
    startNotes?: string[], // TODO - deprecate - use root scale instead, treat chords as root scale
    rootScale?: Scale | undefined,
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

export const ChordListItem = ({ name, scaleDegree, degrees = [], notes = [], startNotes = [] }: ChordListItemProps) => {
    return (
        <div className="p-4 m-2 flex flex-col justify-center items-center border border-solid rounded-sm">
            <span>{scaleDegree}</span>
            <span className="font-bold">{name}</span>
            <span>{degrees?.join(', ')}</span>
            <OverlapList notes={notes} startNotes={startNotes} />
        </div>
    )
}

export default ChordListItem;
