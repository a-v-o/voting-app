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
import { AnimatePresence, motion } from "motion/react";
import ElectionControls from "./ElectionControls";

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
  const duration = 0.2;
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
    <div className="flex flex-col w-full gap-4">
      <Button
        className="mb-4 w-max self-center"
        onClick={() => {
          setHidden(!hidden);
        }}
        variant="outline"
      >
        Add Voters
      </Button>

      <AnimatePresence>
        <div className="overflow-hidden">
          {!hidden && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{
                ease: "linear",
                duration: duration,
              }}
              className="flex flex-col gap-8"
            >
              <form
                action={textFormAction}
                className="flex flex-col gap-4 w-full p-px"
              >
                <Label htmlFor="voters">Voters:</Label>
                <Textarea
                  name="voters"
                  id="voters"
                  placeholder="Enter voters each separated by a comma"
                  className="min-h-32"
                />
                <Input type="hidden" name="election" value={election?.name} />
                <Button className="w-max self-center" pending={textPending}>
                  Add
                </Button>
              </form>

              {textState?.message && (
                <p className="text-red-600 text-center m-4">
                  {textState?.message}
                </p>
              )}

              <form
                className="flex flex-col gap-2 w-full"
                action={uploadFormAction}
              >
                <Input type="hidden" name="election" value={election?.name} />
                <Label htmlFor="voterFile">Upload Voters (Excel File):</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="voterFile"
                    name="voterFile"
                    type="file"
                    accept=".xlsx"
                  />
                  <Button pending={uploadPending}>Upload</Button>{" "}
                </div>
              </form>
              <p className="text-red-600 text-center m-4">
                {uploadState?.message}
              </p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          layout
          transition={{ duration: duration }}
          className="w-full flex flex-col gap-4"
        >
          <h2>Voters:</h2>
          {voters.map((voter, index) => {
            return (
              <form
                key={voter._id.toString()}
                action={deleteVoter}
                className="w-full"
              >
                <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] gap-3">
                  <p>{index + 1}</p>
                  <p className="overflow-auto">{voter.email}</p>

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
                  <Button variant="destructive">Delete</Button>
                </div>
              </form>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center">
        <ElectionControls duration={duration} id={election._id} />
      </div>
    </div>
  );
}
