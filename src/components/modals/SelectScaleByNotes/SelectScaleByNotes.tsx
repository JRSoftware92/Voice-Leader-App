import React from 'react'
import { Check } from "lucide-react"
import { cn } from 'cn'
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

import type { Scale } from "../../../types/Scale.ts";

import {
    getScaleNamesByNotes,
    getScaleInfoByName,
    getScaleChordsByNotes,
} from "../../../voice-leading/identify-scales.js";

import PianoKeyboard from '../../keyboard/PianoKeyboard';

export interface SelectionItem {
    id: string
    label: string
    description?: string
}

interface ListSelectionDialogProps {
    items: SelectionItem[]
    open: boolean,
    setOpen: (open: boolean) => void,
    title?: string
    description?: string
    initialSelectedId?: string
    onAccept: (selectedItem: SelectionItem | null) => void
    triggerButtonText?: string
}

export const ScaleSelectionModal = ({
    onAccept,
    open = false,
    setOpen = () => {},
    title = "Pick a Scale",
    description = "Choose a scale from the list below and click accept to confirm.",
    triggerButtonText = "Open Scale List",
}: ListSelectionDialogProps) => {
    const [selectedId, setSelectedId] = React.useState<string | undefined>(undefined)
    const [notesArr, setNotes] = React.useState<string[]>([]);

    const scaleNames = getScaleNamesByNotes(notesArr);
    const scales = scaleNames.map((name: string) => getScaleInfoByName(name));
    const scalesWithChords = scales.map((scale: Scale) => ({
        ...scale,
        chords: getScaleChordsByNotes(scale.notes, true),
    }))

    const onKeyToggle = (id: string) => {
        if (notesArr.includes(id)) {
            setNotes(notesArr.filter((val) => val !== id));
        } else {
            setNotes([...notesArr, id]);
        }
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const handleAccept = () => {
        const selectedItem = scalesWithChords.find((scale: Scale) => scale.name === selectedId) || null
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
                        {scales.map((scale: Scale) => {
                            const isSelected = selectedId === scale.name
                            return (
                                <button
                                    key={scale.name}
                                    type="button"
                                    onClick={() => setSelectedId(scale.name)}
                                    className={cn(
                                        "flex items-center justify-between w-full text-left px-3 py-2.5 text-sm rounded-sm transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:bg-accent",
                                        isSelected
                                            ? "bg-accent text-accent-foreground font-medium"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-foreground">{scale.name}</span>
                                        {scale.notes && (
                                            <span className="text-xs text-muted-foreground font-normal">
                                                {scale.notes}
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
                <PianoKeyboard selectedKeys={notesArr} onKeyToggle={onKeyToggle} />

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
