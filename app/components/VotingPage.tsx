"use client";

import { vote } from "@/actions/actions";
import { TCandidate, TElection } from "@/utils/types";
import Image from "next/image";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      className="w-full flex flex-col items-center gap-8 p-8 mt-4"
    >
      {election?.posts.map((post) => {
        return (
          <Card key={post} className="w-full md:w-1/2 md:p-8">
            <CardHeader>
              <CardTitle className="capitalize mb-3 text-center" key={post}>
                {post}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup name={post} className="flex flex-col gap-8">
                {candidates.map((candidate) => {
                  if (candidate.post.toLowerCase() == post.toLowerCase()) {
                    return (
                      <Label
                        className="cursor-pointer hover:bg-slate-50 transition-all"
                        htmlFor={candidate.name}
                        key={candidate.name}
                      >
                        <Card>
                          <CardContent className="flex justify-between p-6">
                            <div>
                              <Image
                                src={candidate.image}
                                alt={"Image of " + candidate.name}
                                width={100}
                                height={100}
                              ></Image>
                              <div>
                                <h2 className="mb-3">{candidate.name}</h2>
                                {candidate.extraFields.map((field) => {
                                  return (
                                    <p key={field.name}>
                                      {field.name} : {field.value}
                                    </p>
                                  );
                                })}
                              </div>
                            </div>
                            <RadioGroupItem
                              id={candidate.name}
                              value={candidate._id.toString()}
                            />
                          </CardContent>
                        </Card>
                      </Label>
                    );
                  }
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}
      <Button pending={pending}>Submit Votes</Button>
      <p>{state?.message}</p>
    </form>
  );
}
