import classNames from "classnames";

import { Trash2 } from "lucide-react"

import { Button } from '../ui/button.tsx';

import type { Scale } from "../../types/Scale.ts";

import { getCircleOfFifthColorForNote } from '../../utils/colors';

import NoteList from "../note-list/NoteList.tsx";

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

const OverlapList = ({ notes = [] }) => {
    return (
        <NoteList notes={notes} />
    )
}

export const ScaleListItem = ({ name, scale, onClick, onDelete, selected = false, notes = [] }: ScaleListItemProps) => {
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
            <div className="flex justify-between w-full">
                <span
                    className="m-1 py-1 px-1.5 text-xs rounded font-bold"
                    style={{ color: tonicColor, backgroundColor: `${tonicColor}10`, borderColor: `${tonicColor}30` }}
                >
                    {tonic}
                </span>
                {
                    onDelete ? (
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-2 w-2" />
                        </Button>
                    ) : null
                }
            </div>
            <span className="font-bold">{name}</span>
            <OverlapList notes={scale?.notes || notes} />
        </div>
    )
}

export default ScaleListItem;
