"use client";

import { useEffect, type SetStateAction, type Dispatch } from "react";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "~/components/ui/command";

interface LayoutCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const LayoutCommand = ({ open, setOpen }: LayoutCommandProps) => {
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for novels, authors or actions" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem key="settings">Settings</CommandItem>
          <CommandItem key="write">Start writing</CommandItem>
          <CommandItem key="logout">Logout</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
