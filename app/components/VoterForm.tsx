"use client";

import { useActionState, useState } from "react";
import { addVoters, deleteVoter } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { TElection, TVoter } from "@/utils/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { LoaderIcon } from "lucide-react";

const initialState = {
  message: "",
};

export default function AddVoters({
  election,
  voters,
}: {
  election: TElection;
  voters: TVoter[];
}) {
  const [hidden, setHidden] = useState(true);
  const [state, formAction, pending] = useActionState(addVoters, initialState);

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
          <Button>
            {pending ? (
              <div className="animate-spin">
                <LoaderIcon />
              </div>
            ) : (
              "Add"
            )}
          </Button>
        </form>
      </div>
      <p className="text-red-600 text-center m-4">{state?.message}</p>
      <div className="w-full flex flex-col gap-4">
        {voters.map((voter, index) => {
          return (
            <form
              key={voter._id.toString()}
              action={deleteVoter}
              className="w-full"
            >
              <div className="w-full flex justify-between items-center gap-3">
                <p>{index + 1}</p>
                <p>{voter.email}</p>

                <Input
                  type="hidden"
                  name="voter"
                  value={voter._id.toString()}
                  readOnly={true}
                />
                <Input
                  type="hidden"
                  name="electionName"
                  value={election.name}
                />
                <Button>Delete</Button>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
