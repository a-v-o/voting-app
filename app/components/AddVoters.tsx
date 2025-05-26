"use client";

import { useActionState, useState } from "react";
import { addVoters } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { TElection } from "@/utils/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

const initialState = {
  message: "",
};

export default function AddVoters({ election }: { election: TElection }) {
  const [hidden, setHidden] = useState(true);
  const [state, formAction] = useActionState(addVoters, initialState);

  return (
    <div className="flex flex-col w-full">
      <Button
        className="mb-4"
        onClick={() => {
          setHidden(!hidden);
        }}
      >
        Add Voters
      </Button>

      <div className={hidden ? "hidden" : "flex"}>
        <form action={formAction} className="flex flex-col gap-2 w-full">
          <Label htmlFor="voters">Voters:</Label>
          <Textarea
            name="voters"
            id="voters"
            placeholder="Enter voters each separated by a comma"
          />
          <Input type="hidden" name="election" value={election?.name} />
          <Button>Add</Button>
        </form>
      </div>
      <p className="text-red-600 text-center m-4">{state?.message}</p>
    </div>
  );
}
