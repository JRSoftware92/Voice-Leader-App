import { fn } from 'storybook/test';

import ChordNameByNotes from './ChordNameByNotes.templates.jsx';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Functionality/Chord Name By Notes',
  component: ChordNameByNotes,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ChordNameByNotesStory = {
  args: {
    // notes: ['C', 'E', 'G', 'B']
    height: 160,
    width: 900,
    readonly: false,
    hideLabels: false,
    numberOfOctaves: 3,
  },
};
