"use client";

import { useActionState, useState } from "react";
import {
  addVotersByText,
  addVotersByUpload,
  deleteVoter,
} from "@/actions/actions";
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
  const [textState, textFormAction, textPending] = useActionState(
    addVotersByText,
    initialState
  );
  const [uploadState, uploadFormAction, uploadPending] = useActionState(
    addVotersByUpload,
    initialState
  );

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

      <div className={hidden ? "hidden" : "flex flex-col gap-8"}>
        <form action={textFormAction} className="flex flex-col gap-4 w-full">
          <Label htmlFor="voters">Voters:</Label>
          <Textarea
            name="voters"
            id="voters"
            placeholder="Enter voters each separated by a comma"
            className="min-h-32"
          />
          <Input type="hidden" name="election" value={election?.name} />
          <Button>
            {textPending ? (
              <div className="animate-spin">
                <LoaderIcon />
              </div>
            ) : (
              "Add"
            )}
          </Button>
        </form>

        {textState?.message && (
          <p className="text-red-600 text-center m-4">{textState?.message}</p>
        )}

        <form className="flex flex-col gap-2 w-full" action={uploadFormAction}>
          <Label htmlFor="voterFile">Upload Voters (Excel File):</Label>
          <div className="flex items-center gap-2">
            <Input id="voterFile" name="voterFile" type="file" accept=".xlsx" />
            <Input type="hidden" name="election" value={election?.name} />
            <Button>
              {uploadPending ? (
                <div className="animate-spin">
                  <LoaderIcon />
                </div>
              ) : (
                "Upload"
              )}
            </Button>{" "}
          </div>
        </form>
      </div>
      <p className="text-red-600 text-center m-4">{uploadState?.message}</p>
      <div className="w-full flex flex-col gap-4">
        {voters.map((voter, index) => {
          return (
            <form
              key={voter._id.toString()}
              action={deleteVoter}
              className="w-full"
            >
              <div className="w-full grid grid-cols-[48px_1fr_auto] gap-3">
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
