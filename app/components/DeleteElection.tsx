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
  const deleteElectionWithId = deleteElection.bind(null, id);
  const [state, formAction] = useActionState(
    deleteElectionWithId,
    initialState
  );

  return (
    <div className="flex flex-col gap-4 items-center">
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>Delete Election</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
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
            <AlertDialogAction>
              <form action={formAction}>
                <button>Confirm</button>
              </form>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <p className="text-red-500">{state.message}</p>
    </div>
  );
}
