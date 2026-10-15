const CIRCLE_OF_FIFTHS_COLORS = {
  "C":  "#FF0000", // Red
  "G":  "#FF7F00", // Orange
  "D":  "#FFFF00", // Yellow
  "A":  "#00FF00", // Green
  "E":  "#0000FF", // Blue
  "B":  "#4B0082", // Indigo
  "F#": "#8B00FF", // Violet
  "Gb": "#8B00FF", // Violet (Enharmonic equivalent)
  "Db": "#FF1493", // Deep Pink / Crimson
  "C#": "#FF1493", // Crimson (Enharmonic equivalent)
  "Ab": "#7FFF00", // Chartreuse / Yellow-Green
  "G#": "#7FFF00", // Yellow-Green (Enharmonic equivalent)
  "Eb": "#00FFFF", // Cyan
  "D#": "#00FFFF", // Cyan (Enharmonic equivalent)
  "Bb": "#1E90FF", // Dodger Blue
  "A#": "#1E90FF", // Dodger Blue (Enharmonic equivalent)
  "F":  "#FF4500"  // Red-Orange
};

export const getCircleOfFifthColorForNote = (note) => CIRCLE_OF_FIFTHS_COLORS[note] || '#000000';
