import classNames from "classnames";

import { Trash2 } from "lucide-react"

import { Button } from '../ui/button.tsx';

import type { Scale } from "../../types/Scale.ts";

import { getCircleOfFifthColorForNote } from '../../utils/colors';

type ScaleListItemProps = {
    name: string,
    scale: Scale,
    onClick?: (scale: Scale) => void,
    onDelete?: () => void,
    degrees?: string[],
    notes?: string[],
    startNotes?: string[],
    selected?: boolean,
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

export const ScaleListItem = ({ name, scale, onClick, onDelete, selected = false, notes = [], startNotes = [] }: ScaleListItemProps) => {
    const hasClickFunction = onClick !== undefined;
    const handleClick = () => {
        if (hasClickFunction) {
            onClick(scale);
        }
    }
    const clickProps = hasClickFunction ? { onClick: handleClick } : {};

    const handleDelete = () => {
        if (onDelete) {
            onDelete(scale);
        }
    }

    const tonic = scale?.tonic.replace(/\d/g, '');
    const tonicColor = getCircleOfFifthColorForNote(tonic);

    return (
        <div className={classNames("p-2 m-1 flex flex-col justify-center items-center border border-solid rounded-sm", {
            'cursor-pointer': hasClickFunction,
            'border-blue-400': selected,
        })} {...clickProps}>
            <div className="flex justify-between flex-row-reverse w-full">
                {
                    onDelete ? (
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-2 w-2" />
                        </Button>
                    ) : null
                }
            </div>
            <span className="font-bold" style={{ color: tonicColor }}>{name}</span>
            <OverlapList notes={notes} startNotes={startNotes} />
        </div>
    )
}

export default ScaleListItem;
