import React from 'react'
import { Check } from "lucide-react"
import { cn } from 'cn'
import { Chord } from "tonal";

import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../ui/dialog';

import type { Chord as ChordType } from "../../../types/Chord.ts";

import {
    identifyPossibleChords,
} from "../../../voice-leading/identify-chords.js";

import PianoKeyboard from '../../keyboard/PianoKeyboard';

export interface SelectionItem {
    id: string
    label: string
    description?: string
}

interface ListSelectionDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    title?: string
    description?: string
    initialSelectedId?: string
    onAccept: (selectedItem: SelectionItem | null) => void
    triggerButtonText?: string
}

export const ScaleSelectionModal = ({
                                        notes = [],
                                        onAccept,
                                        open = false,
                                        setOpen = () => {},
                                        title = "Pick a Chord",
                                        description = "Choose a chord from the list below and click accept to confirm.",
                                        triggerButtonText = "Open chord List",
                                    }: ListSelectionDialogProps) => {
    const [selectedId, setSelectedId] = React.useState<string | undefined>(undefined)

    const chordNames = identifyPossibleChords(notes);
    const chords = chordNames?.map((chordName) => Chord.get(chordName));

    const handleCancel = () => {
        setOpen(false)
    }

    const handleAccept = () => {
        const selectedItem = chords.find((chord: ChordType) => chord.symbol === selectedId) || null
        onAccept(selectedItem)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">{triggerButtonText}</Button>
            </DialogTrigger>

            <DialogContent className="w-full flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {/* Scrollable list area */}
                <ScrollArea className="flex-1 pr-4 border rounded-md max-h-[350px]">
                    <div className="flex flex-col p-1 gap-1">
                        {chords.map((chord: ChordType) => {
                            const isSelected = selectedId === chord.symbol
                            return (
                                <button
                                    key={chord.symbol}
                                    type="button"
                                    onClick={() => setSelectedId(chord.symbol)}
                                    className={cn(
                                        "flex items-center justify-between w-full text-left px-3 py-2.5 text-sm rounded-sm transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:bg-accent",
                                        isSelected
                                            ? "bg-accent text-accent-foreground font-medium"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-foreground">{chord.symbol}</span>
                                        {chord.notes && (
                                            <span className="text-xs text-muted-foreground font-normal">
                                                {chord.notes}
                                            </span>
                                        )}
                                    </div>
                                    {isSelected && (
                                        <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>

                {/* Action Buttons */}
                <DialogFooter className="sm:justify-end gap-2 pt-2 border-t">
                    <Button variant="ghost" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleAccept} disabled={!selectedId}>
                        Accept
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ScaleSelectionModal;
