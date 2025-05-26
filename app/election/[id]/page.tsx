import dbConnect from "@/utils/db";
import { Candidate, Election } from "@/models/models";
import { notFound } from "next/navigation";
import { TElection } from "@/utils/types";
import { Types } from "mongoose";
import VotingPage from "@/components/VotingPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: Types.ObjectId }>;
  searchParams: Promise<{ voterCode: string }>;
}) {
  await dbConnect();
  const { id } = await params;
  const { voterCode } = await searchParams;

  const election: TElection = await Election.findById(id).exec();

  const candidates = await Candidate.find({
    _id: { $in: election.candidates },
  }).exec();

  if (!election) {
    notFound();
  }

  return (
    <VotingPage
      election={JSON.parse(JSON.stringify(election))}
      candidates={JSON.parse(JSON.stringify(candidates))}
      voterCode={voterCode}
    />
  );
}
