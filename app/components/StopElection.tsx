"use client";

import { stopElection } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Types } from "mongoose";

const initialState = {
  message: "",
};

export default function StopElection({ id }: { id: Types.ObjectId }) {
  const stopElectionWithId = stopElection.bind(null, id);
  const [state, formAction] = useActionState(stopElectionWithId, initialState);

  return (
    <div className="flex flex-col items-center">
      <form action={formAction}>
        <Button>Stop Election</Button>
      </form>
      <p className="text-red-500">{state.message}</p>
    </div>
  );
}
