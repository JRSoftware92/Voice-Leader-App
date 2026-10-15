import classNames from "classnames";

import {Trash2} from "lucide-react";

import type {Scale} from "../../types/Scale.ts";
import type {Chord} from "../../types/Chord.ts";

import {Button} from "../ui/button.tsx";
import { getCircleOfFifthColorForNote } from '../../utils/colors';
import NoteList from "../note-list/NoteList.tsx";


type ChordListItemProps = {
    chord: Chord,
    name: string,
    selected?: boolean,
    onClick?: (chord: Chord) => void,
    onDelete?: (chord: Chord) => void,
    scaleDegree?: string,
    degrees?: string[],
    notes?: string[],
    startNotes?: string[], // TODO - deprecate - use root scale instead, treat chords as root scale
    rootScale?: Scale | undefined,
}

const OverlapList = ({ notes = [] }) => {
    return (
        <NoteList notes={notes} />
    )
}

export const ChordListItem = ({ chord, name, scaleDegree, onClick, onDelete, selected = false, degrees = [], notes = [], startNotes = [] }: ChordListItemProps) => {
    const hasClickFunction = onClick !== undefined;
    const handleClick = () => {
        if (hasClickFunction) {
            onClick(chord);
        }
    }
    const clickProps = hasClickFunction ? { onClick: handleClick } : {};

    const handleDelete = () => {
        if (onDelete) {
            onDelete(chord);
        }
    }

    const tonic = chord?.tonic.replace(/\d/g, '');
    const tonicColor = getCircleOfFifthColorForNote(tonic);

    return (
        <div className={classNames("pb-4 mb-2 flex flex-col justify-center items-center border border-solid rounded-sm", {
            'cursor-pointer': hasClickFunction,
            'border-blue-400': selected,
        })} {...clickProps}>
            <div className={classNames("flex justify-between w-full", {
                'm-2': !scaleDegree
            })}>
                <div className="flex justify-start">
                    <span
                        className="m-1 py-1 px-1.5 text-xs rounded font-bold"
                        style={{ color: tonicColor, backgroundColor: `${tonicColor}10`, borderColor: `${tonicColor}30` }}
                    >
                        {tonic}
                    </span>
                    {
                        scaleDegree ? (
                            <span className="m-1 py-1 px-1.5 text-xs border border-gray-200 bg-gray-100 text-gray-700 rounded">{scaleDegree}</span>
                        ) : null
                    }
                </div>
                {
                    onDelete ? (
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-2 w-2" />
                        </Button>
                    ) : null
                }
            </div>
            <span className="font-bold">{name}</span>
            <span>{degrees?.join(', ')}</span>
            <OverlapList notes={notes} />
        </div>
    )
}

export default ChordListItem;
