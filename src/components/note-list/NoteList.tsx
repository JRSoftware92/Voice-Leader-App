import { getCircleOfFifthColorForNote } from '../../utils/colors';

type NoteListProps = {
    notes: string[],
}

const NoteListItem = ({ note }) => {
    const tonicColor = getCircleOfFifthColorForNote(note);
    return (
        <span className="border p-1 text-xs" style={{ color: tonicColor, backgroundColor: `${tonicColor}10`, borderColor: `${tonicColor}30` }}>
            {note}
        </span>
    )
}

export const NoteList = ({ notes = [] }: NoteListProps) => {
    return (
        <div className="p-1 m-2 flex items-center">
            {
               notes?.map((note) => (
                   <NoteListItem note={note.replace(/\d/g, '')} />
               ))
            }
        </div>
    )
}

export default NoteList;
