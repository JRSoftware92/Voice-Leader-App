import React, {JSX, useMemo, useState} from "react";

import { cn } from 'cn';

const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

const TOTAL_KEYS = 37;

function buildKeys(startOctave: number) {
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

type PianoKeyboardProps = {
    selectedKeys: string[],
    onKeyToggle: (selectedKey: string) => void,
    startOctave?: number,
    keyboardWidth?: number,
    keyHeight?: number,
    readonly?: boolean,
    hideLabels?: boolean,
}

export default function PianoKeyboard({
    selectedKeys,
    onKeyToggle,
    startOctave = 3,
    keyboardWidth = 900,
    keyHeight = 160,
    readonly = false,
    hideLabels = false,
}: PianoKeyboardProps): JSX.Element {
  // If the parent doesn't pass `selectedKeys`, fall back to internal state
  // so the keyboard is still fully interactive with zero setup.
  const isControlled = selectedKeys !== undefined;
  const [internalSelected, setInternalSelected] = useState([]);
  const activeSelected = isControlled ? selectedKeys : internalSelected;

  const keys = useMemo(() => buildKeys(startOctave), [startOctave]);
  const whiteKeys = keys.filter((k) => !k.isSharp);
  const isSelected = (id: string) => activeSelected.includes(id);

  const toggleKey = (id: string) => {
    if (!isControlled) {
      setInternalSelected((prev: string[]) =>
        prev.includes(id) ? prev.filter((k: string) => k !== id) : [...prev, id]
      );
    }
    if (onKeyToggle) onKeyToggle(id);
  };

  const handleClick = (id) => {
      if (readonly) {
          return;
      }
      toggleKey(id);
  };

  const handleKeyDown = (e, id) => {
    if (!readonly && e.key === "Enter" || e.key === " ") {
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
    <div className="mx-auto box-border w-full rounded-xl bg-[#1B1D23] p-5" style={{ width: keyboardWidth }}>
        {
            !hideLabels && (
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
            )
        }
      <div className="relative flex w-full select-none" style={{ height: keyHeight }}>
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
              className={cn(`relative box-border flex h-full items-end justify-center rounded-b-md border pb-2 transition-colors duration-75 ease-out ${
                selected
                  ? "border-[#3E7CB1] bg-[#3E7CB1]"
                  : "border-[#B8BAC0] bg-[#F7F6F3]"
              }`, { 'cursor-pointer': !readonly })}
            >
              {k.name === "C" && !hideLabels && (
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
              className={cn(`absolute top-0 z-[2] box-border h-[62%] rounded-b border border-black transition-colors duration-75 ease-out ${
                selected ? "bg-[#3E7CB1]" : "bg-[#202127]"
              }`, { 'cursor-pointer': !readonly })}
            />
          );
        })}
      </div>
    </div>
  );
}
