"use client";

import { stopElection } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Types } from "mongoose";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const initialState = {
  message: "",
};

export default function StopElection({ id }: { id: Types.ObjectId }) {
  const stopElectionWithId = stopElection.bind(null, id);
  const [state, formAction, pending] = useActionState(
    stopElectionWithId,
    initialState
  );

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Dialog>
        <DialogTrigger asChild className="w-full">
          <Button pending={pending} className="w-full">
            Stop Election
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90%]">
          <DialogHeader>
            <DialogTitle>Stop Election</DialogTitle>
            <DialogDescription>
              Are you sure you want to stop the election?
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="w-full flex flex-col gap-3">
            <Button pending={pending} type="submit" className="w-full">
              Confirm
            </Button>
          </form>
          <p className="text-center text-red-500 text-sm">{state?.message}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
