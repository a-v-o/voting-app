"use client";
import { TCandidate, TElection } from "@/utils/types";
import { useActionState, useState } from "react";
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
import { LoaderIcon } from "lucide-react";

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
  const posts = election?.posts;
  const [hidden, setHidden] = useState(true);
  const [state, formAction, pending] = useActionState(
    createNewCandidate,
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
        Add Candidate
      </Button>

      <div className={hidden ? "hidden" : "flex"}>
        <form action={formAction} className="flex flex-col gap-2 w-full">
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
          <input type="hidden" name="election" value={election?.name} />
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
      <h2>Candidates:</h2>
      <div>
        {election?.posts.map((post) => {
          return (
            <form
              key={post}
              action={deleteCandidate}
              className="w-full flex flex-col items-center gap-8"
            >
              <div className="w-full mt-4">
                <h1
                  className="capitalize mb-3 text-center font-bold"
                  key={post}
                >
                  {post.toUpperCase()}
                </h1>
                <div className="flex flex-col gap-4 w-full">
                  {candidates.map((candidate) => {
                    if (candidate.post.toLowerCase() == post.toLowerCase()) {
                      return (
                        <div
                          className="w-full flex gap-3 justify-between items-center"
                          key={candidate.name}
                        >
                          <Image
                            src={candidate.image}
                            width={36}
                            height={36}
                            alt={"Image of" + candidate.name}
                            className="rounded"
                          ></Image>
                          <Input
                            type="text"
                            name="candidate"
                            id={candidate.name}
                            value={candidate.name}
                            readOnly={true}
                            className="outline-0 border-0"
                          />
                          <Input
                            type="hidden"
                            name="electionName"
                            value={election.name}
                          />
                          <Button>Delete</Button>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
