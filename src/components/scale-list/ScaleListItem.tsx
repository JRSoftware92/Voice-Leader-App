import classNames from "classnames";

import type { Scale } from "../../types/Scale.ts";

type ScaleListItemProps = {
    name: string,
    scale: Scale,
    onClick?: (scale: Scale) => void,
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

export const ScaleListItem = ({ name, scale, onClick, notes = [], startNotes = [] }: ScaleListItemProps) => {
    const hasClickFunction = onClick !== undefined;
    const handleClick = () => {
        if (hasClickFunction) {
            onClick(scale);
        }
    }
    const clickProps = hasClickFunction ? { onClick: handleClick } : {};
    return (
        <div className={classNames("p-4 m-2 flex flex-col justify-center items-center border border-solid rounded-sm", {
            'cursor-pointer': hasClickFunction,
        })} {...clickProps}>
            <span className="font-bold">{name}</span>
            <OverlapList notes={notes} startNotes={startNotes} />
        </div>
    )
}

export default ScaleListItem;
