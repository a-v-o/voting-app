"use client";

import { confirmElection } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Types } from "mongoose";

const initialState = {
  message: "",
};

export default function ConfirmElection({ id }: { id: Types.ObjectId }) {
  const confirmElectionWithId = confirmElection.bind(null, id);
  const [state, formAction] = useActionState(
    confirmElectionWithId,
    initialState
  );

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form action={formAction}>
        <Button>Confirm Election</Button>
      </form>
      <p className="text-red-500 text-sm">{state.message}</p>
    </div>
  );
}
