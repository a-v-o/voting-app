"use client";

import { deleteElection } from "@/actions/actions";
import { Types } from "mongoose";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";

const initialState = {
  message: "",
};

export default function DeleteElection({ id }: { id: Types.ObjectId }) {
  const [state, formAction] = useActionState(
    deleteElection,
    initialState,
    pending
  );

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <AlertDialog>
        <AlertDialogTrigger asChild className="w-full">
          <Button pending={pending} className="w-full" variant="destructive">
            Delete Election
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[90%]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this election?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. Your progress will not be saved and
              the election will be deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={formAction} className="w-full">
              <AlertDialogAction className="w-full">
                  <input type="hidden" name="electionId" value={id.toString()}/>
                  <button type="submit">Confirm</button>
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <p className="text-red-500">{state.message}</p>
    </div>
  );
}
