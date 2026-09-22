import React, { useMemo, useState } from "react";

/**
 * PianoKeyboard
 * -------------
 * A 37-key piano keyboard (3 octaves + 1 note, C3 -> C6).
 *
 * This component supports two modes:
 *
 * 1. CONTROLLED (recommended) - pass `selectedKeys` (and, if you want to
 *    react to changes, `onKeyToggle`). The parent owns the array of
 *    selected notes and this component just reflects it.
 *
 *        <PianoKeyboard selectedKeys={keys} onKeyToggle={handleToggle} />
 *
 * 2. UNCONTROLLED (drop-in) - omit `selectedKeys` entirely. The component
 *    manages its own internal selection state, so clicking keys highlights
 *    them immediately with zero extra wiring. `onKeyToggle` is still
 *    called (if provided) so you can observe/log selections.
 *
 *        <PianoKeyboard />
 *
 * Props:
 *  - selectedKeys: string[] | undefined   array of currently selected note
 *                                          ids, e.g. ["C3", "D#3", "G4"].
 *                                          Omit to let the component manage
 *                                          its own state.
 *  - onKeyToggle:  (noteId) => void       called with a note id whenever a
 *                                          key is clicked
 *  - startOctave:  number                 optional, defaults to 3 (C3..C6)
 *
 * Styling: Tailwind CSS utility classes (no inline styles / style objects).
 */

const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

const TOTAL_KEYS = 37;

function buildKeys(startOctave) {
  const keys = [];
  for (let i = 0; i < TOTAL_KEYS; i++) {
    const noteIndex = i % 12;
    const octave = startOctave + Math.floor(i / 12);
    const name = NOTE_NAMES[noteIndex];
    const isSharp = name.includes("#");
    keys.push({
      id: `${name}${octave}`,
      name,
      octave,
      isSharp,
    });
  }
  return keys;
}

export default function PianoKeyboard({
                                        selectedKeys,
                                        onKeyToggle,
                                        startOctave = 3,
                                      }) {
  // If the parent doesn't pass `selectedKeys`, fall back to internal state
  // so the keyboard is still fully interactive with zero setup.
  const isControlled = selectedKeys !== undefined;
  const [internalSelected, setInternalSelected] = useState([]);
  const activeSelected = isControlled ? selectedKeys : internalSelected;

  const keys = useMemo(() => buildKeys(startOctave), [startOctave]);
  const whiteKeys = keys.filter((k) => !k.isSharp);
  const isSelected = (id) => activeSelected.includes(id);

  const toggleKey = (id) => {
    if (!isControlled) {
      setInternalSelected((prev) =>
        prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
      );
    }
    if (onKeyToggle) onKeyToggle(id);
  };

  const handleClick = (id) => {
    toggleKey(id);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleKey(id);
    }
  };

  // Black keys are positioned absolutely, offset by how many white keys
  // precede them. We compute an x-offset in "white key units" for each.
  let whiteCount = 0;
  const blackKeyPositions = keys.map((k) => {
    if (!k.isSharp) {
      whiteCount += 1;
      return null;
    }
    // Black key sits between the previous and current white key,
    // slightly left of the boundary.
    return { ...k, offset: whiteCount - 0.28 };
  });

  const whiteKeyWidth = 100 / whiteKeys.length;

  return (
    <div className="mx-auto box-border w-full min-w-[900px] rounded-xl bg-[#1B1D23] p-5">
      <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-1.5">
        <span className="text-[15px] font-semibold tracking-[0.2px] text-[#EDEEF0]">
          Keyboard
        </span>
        <span className="max-w-[60%] text-right text-[13px] break-words text-[#8B8F98]">
          {activeSelected.length > 0
            ? activeSelected.join(", ")
            : "no keys selected"}
        </span>
      </div>

      <div className="relative flex h-[160px] w-full select-none">
        {whiteKeys.map((k) => {
          const selected = isSelected(k.id);
          return (
            <div
              key={k.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`Key ${k.id}`}
              onClick={() => handleClick(k.id)}
              onKeyDown={(e) => handleKeyDown(e, k.id)}
              style={{ width: `${whiteKeyWidth}%` }}
              className={`relative box-border flex h-full cursor-pointer items-end justify-center rounded-b-md border pb-2 transition-colors duration-75 ease-out ${
                selected
                  ? "border-[#3E7CB1] bg-[#3E7CB1]"
                  : "border-[#B8BAC0] bg-[#F7F6F3]"
              }`}
            >
              {k.name === "C" && (
                <span className="pointer-events-none text-[11px] text-[#9A9CA3]">
                  C{k.octave}
                </span>
              )}
            </div>
          );
        })}

        {blackKeyPositions.map((k) => {
          if (!k) return null;
          const selected = isSelected(k.id);
          return (
            <div
              key={k.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`Key ${k.id}`}
              onClick={() => handleClick(k.id)}
              onKeyDown={(e) => handleKeyDown(e, k.id)}
              style={{
                left: `${k.offset * whiteKeyWidth}%`,
                width: `${whiteKeyWidth * 0.62}%`,
              }}
              className={`absolute top-0 z-[2] box-border h-[62%] rounded-b border border-black transition-colors duration-75 ease-out ${
                selected ? "bg-[#3E7CB1]" : "bg-[#202127]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
