"use client"

import * as React from "react"
import {
    Button,
    ListBox,
    ListBoxItem,
    Popover,
    Select,
    SelectValue,
    type ListBoxItemProps,
    type SelectProps,
} from "react-aria-components"
import { Check, ChevronDown } from "lucide-react"

export interface AriaSelectProps<T extends object> extends Omit<SelectProps<T>, "children"> {
    label?: string
    placeholder?: string
    children: React.ReactNode | ((item: T) => React.ReactNode)
}

export function AriaSelect<T extends object>({
                                                 label,
                                                 placeholder,
                                                 children,
                                                 ...props
                                             }: AriaSelectProps<T>) {
    return (
        <Select {...props} className="flex flex-col gap-1.5 w-[180px]">
            {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
            <Button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pressed:bg-accent pressed:text-accent-foreground data-[focused]:ring-2 data-[focused]:ring-ring">
                <SelectValue placeholder={placeholder} className="truncate" />
                <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
            </Button>
            <Popover className="z-50 min-w-[var(--trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md entering:animate-in entering:fade-in-0 entering:zoom-in-95 leaving:animate-out leaving:fade-out-0 leaving:zoom-out-95">
                <ListBox className="p-1 outline-none max-h-72 overflow-y-auto">
                    {children}
                </ListBox>
            </Popover>
        </Select>
    )
}

export function AriaSelectItem(props: ListBoxItemProps) {
    return (
        <ListBoxItem
            {...props}
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[focused]:bg-accent data-[focused]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
            {({ isSelected }) => (
                <>
                    {isSelected && (
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              <Check className="h-4 w-4" />
            </span>
                    )}
                    {props.children}
                </>
            )}
        </ListBoxItem>
    )
}

export default AriaSelect;
