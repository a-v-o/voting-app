"use client";

import { createElection } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const initialState = {
  message: "",
};

export default function CreateElection() {
  const [state, formAction, pending] = useActionState(
    createElection,
    initialState
  );

  return (
    <div className="flex flex-col gap-2 items-center">
      <div>
        <form action={formAction} className="flex flex-col gap-2">
          <Label htmlFor="electionName">Election Name:</Label>
          <Input type="text" name="electionName" id="electionName" />
          <Button pending={pending}>New Election</Button>
        </form>
      </div>
      <p className="text-red-500 p-8 text-center">{state.message}</p>
    </div>
  );
}
