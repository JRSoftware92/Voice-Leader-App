import classNames from "classnames";

import type {Scale} from "../../types/Scale.ts";

type ChordListItemProps = {
    name: string,
    scaleDegree?: string,
    degrees?: string[],
    notes?: string[],
    startNotes?: string[], // TODO - deprecate - use root scale instead, treat chords as root scale
    rootScale?: Scale | undefined,
}

const OverlapList = ({ notes = [], startNotes = []}) => {
    return (
        <div className="mt-1 flex justify-center items-center">
            {
                notes.map((note, index) => (
                    <span className={classNames('mx-1 text-xs', { 'text-red-500': startNotes[index] === note} )}>{note}</span>
                ))
            }
        </div>
    )
}

export const ChordListItem = ({ name, scaleDegree, degrees = [], notes = [], startNotes = [] }: ChordListItemProps) => {
    return (
        <div className="pb-4 mb-2 flex flex-col justify-center items-center border border-solid rounded-sm">
            <div className="flex justify-between flex-row-reverse w-full">
                <span className="m-1 py-1 px-1.5 text-xs border border-gray-200 bg-gray-100 text-gray-700 rounded">{scaleDegree}</span>
            </div>
            <span className="font-bold">{name}</span>
            <span>{degrees?.join(', ')}</span>
            <OverlapList notes={notes} startNotes={startNotes} />
        </div>
    )
}

export default ChordListItem;
