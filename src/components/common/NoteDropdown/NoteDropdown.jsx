import * as React from 'react';

import AriaSelect, {AriaSelectItem} from "../select.tsx";

// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
// import Select from '@mui/material/Select';

const NOTES = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

export const NoteDropdown = ({
    id = "note-dropdown",
    note = 'C',
    label = 'Note',
    onNoteSelected = () => {},
}) => {
    const handleChange = (val) => {
        onNoteSelected(val);
    };

    return (
        <div className="flex flex-col mt-8">
            <AriaSelect
              id={id}
              label={label}
              variant="standard"
              defaultValue="C"
              value={note}
              onChange={handleChange}
            >
              {
                NOTES.map((note) => (
                  <AriaSelectItem id={note}>
                    {note}
                  </AriaSelectItem>
                ))
              }
            </AriaSelect>
        </div>
    );
}

export default NoteDropdown;
