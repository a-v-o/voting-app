"use client";

import { confirmElection } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { Types } from "mongoose";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const initialState = {
  message: "",
};

export default function ConfirmElection({ id }: { id: Types.ObjectId }) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const confirmElectionWithIdAndDate = confirmElection.bind(null, id, date);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    confirmElectionWithIdAndDate,
    initialState
  );

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* <form action={formAction}>
        <Button pending={pending}>Confirm Election</Button>
      </form> */}
      <Dialog>
        <DialogTrigger asChild className="w-full">
          <Button pending={pending} className="w-full">
            Confirm Election
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90%]">
          <DialogHeader>
            <DialogTitle>Confirm Election</DialogTitle>
            <DialogDescription>
              Set a date and time the election will go live and confirm. This
              will send an email to each voter containing the login details
              required to vote
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="date-picker">Date</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" id="date-picker">
                {date ? date.toLocaleDateString() : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                }}
              />
            </PopoverContent>
          </Popover>
          <form action={formAction} className="w-full flex flex-col gap-3">
            <Label htmlFor="start-time-picker">Start Time</Label>
            <Input
              id="start-time-picker"
              type="time"
              step="1"
              name="start-time"
            />
            <Label htmlFor="end-time-picker">End Time</Label>
            <Input id="end-time-picker" type="time" step="1" name="end-time" />
            <Button pending={pending} type="submit" className="w-full">
              Confirm
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <p className="text-center text-red-500 text-sm">{state.message}</p>
    </div>
  );
}
