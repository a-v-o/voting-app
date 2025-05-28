"use client";

import { vote } from "@/actions/actions";
import { TCandidate, TElection } from "@/utils/types";
import Image from "next/image";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";

const initialState = {
  message: "",
};

export default function VotingPage({
  election,
  candidates,
  voterCode,
}: {
  election: TElection;
  candidates: TCandidate[];
  voterCode: string;
}) {
  const voteInElection = vote.bind(null, election._id, voterCode);
  const [state, formAction, pending] = useActionState(
    voteInElection,
    initialState
  );

  return (
    <form
      action={formAction}
      className="w-full flex flex-col items-center gap-8 p-8"
    >
      {election?.posts.map((post) => {
        return (
          <div key={post} className="w-1/2 p-8 border rounded">
            <h1 className="capitalize mb-3 text-center" key={post}>
              {post}
            </h1>
            <div className="flex flex-col gap-8">
              {candidates.map((candidate) => {
                if (candidate.post.toLowerCase() == post.toLowerCase()) {
                  return (
                    <label
                      className="cursor-pointer hover:bg-slate-50 transition-all"
                      htmlFor={candidate.name}
                      key={candidate.name}
                    >
                      <div className="flex justify-between border p-4 rounded">
                        <div>
                          <h2 className="mb-3">{candidate.name}</h2>
                          <Image
                            src={candidate.image}
                            alt={"Image of " + candidate.name}
                            width={100}
                            height={100}
                          ></Image>
                        </div>
                        <input
                          type="radio"
                          name={post}
                          id={candidate.name}
                          value={candidate._id.toString()}
                        />
                      </div>
                    </label>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      <Button>
        {pending ? (
          <div>
            <LoaderIcon />
          </div>
        ) : (
          "Submit Votes"
        )}
      </Button>
      <p>{state?.message}</p>
    </form>
  );
}
