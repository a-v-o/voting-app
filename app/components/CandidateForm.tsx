"use client";
import { TCandidate, TElection } from "@/utils/types";
import { useActionState, useEffect, useState } from "react";
import { createNewCandidate, deleteCandidate } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "motion/react";
import ElectionControls from "./ElectionControls";
import { InfoIcon } from "lucide-react";

const initialState = {
  message: "",
};

export default function CandidateForm({
  election,
  candidates,
}: {
  election: TElection;
  candidates: TCandidate[];
}) {
  const duration = 0.2;
  const posts = election?.posts;
  const [hidden, setHidden] = useState(true);
  const [extraFieldHidden, setExtraFieldHidden] = useState(true);
  const [field, setField] = useState("");
  const [extraFields, setExtraFields] = useState<string[]>([]);
  const createNewCandidateWithExtraFields = createNewCandidate.bind(
    null,
    extraFields
  );

  const [state, formAction, pending] = useActionState(
    createNewCandidateWithExtraFields,
    initialState
  );

  const [deleteState, deleteAction] = useActionState(
    deleteCandidate,
    initialState
  );

  useEffect(() => {
    const extraFieldsFromStorage = localStorage.getItem("extraFields");
    if (extraFieldsFromStorage)
      setExtraFields(JSON.parse(extraFieldsFromStorage));
    console.log(extraFieldsFromStorage);
  }, []);

  return (
    <div className="flex flex-col w-full gap-4">
      <Button
        className="mb-4 w-max self-center"
        onClick={() => {
          setHidden(!hidden);
        }}
        variant="outline"
      >
        Add Candidate
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
              className="flex flex-col gap-4 overflow-hidden"
            >
              <form
                action={formAction}
                className="flex flex-col gap-4 w-full p-px"
              >
                <Select name="post">
                  <SelectTrigger>
                    <SelectValue placeholder="Select post" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Posts</SelectLabel>
                      {posts &&
                        posts.map((post) => {
                          return (
                            <SelectItem key={post} value={post}>
                              {post}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Label htmlFor="candidate">Candidate Name:</Label>
                <Input type="text" name="candidate" id="candidate" />
                <Input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  name="picture"
                  id="picture"
                />
                <span className="text-xs text-red-500 flex items-center gap-2">
                  <InfoIcon /> File shouldn&apos;t be larger than 1MB
                </span>
                {extraFields.map((field) => {
                  return (
                    <div
                      key={field}
                      className="flex items-end justify-between gap-4"
                    >
                      <div className="w-full">
                        <Label htmlFor={field}>{field}</Label>
                        <Input type="text" name={field} id={field} />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const newExtraFields = extraFields.filter(
                            (fieldName) => fieldName != field
                          );
                          localStorage.setItem(
                            "extraFields",
                            JSON.stringify(newExtraFields)
                          );
                          setExtraFields(newExtraFields);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  );
                })}
                <input type="hidden" name="election" value={election?.name} />
                <Button className="w-max self-center" pending={pending}>
                  Add
                </Button>
                {state?.message && (
                  <p className="text-red-600 text-center m-4">
                    {state?.message}
                  </p>
                )}
              </form>

              <Button
                className="mb-4 w-max self-center"
                onClick={() => {
                  setExtraFieldHidden(!extraFieldHidden);
                }}
                variant="outline"
              >
                Add Field
              </Button>

              {!extraFieldHidden && (
                <div className="flex gap-4 items-center">
                  <Input
                    type="text"
                    name="extraField"
                    id="extraField"
                    onChange={(e) => {
                      setField(e.target.value);
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (field == "") return;
                      if (extraFields.includes(field)) return;
                      localStorage.setItem(
                        "extraFields",
                        JSON.stringify([...extraFields, field])
                      );
                      setExtraFields([...extraFields, field]);
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div layout transition={{ duration: duration }}>
          <h2>Candidates:</h2>
          <div>
            {election?.posts.map((post) => {
              return (
                <div
                  key={post}
                  className="w-full flex flex-col items-center gap-8"
                >
                  <div className="w-full mt-4">
                    <p
                      className="capitalize mb-3 text-center text-xl font-semibold"
                      key={post}
                    >
                      {post.toUpperCase()}
                    </p>
                    <div className="flex flex-col gap-4 w-full">
                      {candidates.map((candidate) => {
                        if (
                          candidate.post.toLowerCase() == post.toLowerCase()
                        ) {
                          return (
                            <form
                              action={deleteAction}
                              className="w-full flex gap-3 justify-between items-center"
                              key={candidate.name}
                            >
                              <div className="w-12 h-12 overflow-hidden rounded">
                                <Image
                                  src={candidate.image}
                                  width={48}
                                  height={48}
                                  alt={"Image of" + candidate.name}
                                  style={{ objectFit: "cover" }}
                                ></Image>
                              </div>
                              <div className="overflow-auto text-nowrap">
                                <p className="text-sm md:text-base">
                                  {candidate.name}
                                </p>
                              </div>
                              <Input
                                type="hidden"
                                name="candidate"
                                value={candidate._id.toString()}
                              />
                              <Input
                                type="hidden"
                                name="election"
                                value={election._id.toString()}
                              />
                              <Button variant="destructive">Delete</Button>
                            </form>
                          );
                        }
                      })}
                    </div>
                  </div>
                  <p className="text-red-600 text-center m-4">
                    {deleteState?.message}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center">
        <ElectionControls duration={0.4} id={election._id} />
      </div>
    </div>
  );
}
