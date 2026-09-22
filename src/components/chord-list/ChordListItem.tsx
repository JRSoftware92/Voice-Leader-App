type ChordListItemProps = {
    name: string,
    degrees?: string[],
    notes?: string[],
}

export const ChordListItem = ({ name, degrees = [], notes = [] }: ChordListItemProps) => {
    return (
        <div className="p-4 m-2 flex flex-col justify-center items-center border border-solid rounded-sm">
            <span className="font-bold">{name}</span>
            <span>{degrees?.join(', ')}</span>
            <span>{notes?.join(', ')}</span>
        </div>
    )
}

export default ChordListItem;
