import AddVoters from "@/components/AddVoters";
import CandidateForm from "@/components/CandidateForm";
import { TElection } from "@/utils/types";
import PostForm from "@/components/PostForm";
import { notFound } from "next/navigation";
import { Candidate, Election } from "@/models/models";
import dbConnect from "@/utils/db";
import { Types } from "mongoose";
import ConfirmElection from "@/components/ConfirmElection";
import DeleteElection from "@/components/DeleteElection";
import StopElection from "@/components/StopElection";

export default async function Page({
  params,
}: {
  params: Promise<{ id: Types.ObjectId }>;
}) {
  await dbConnect();
  const { id } = await params;

  const res = await Election.findOne({ _id: id }).exec();
  const election: TElection = JSON.parse(JSON.stringify(res));

  const candidates = await Candidate.find({
    _id: { $in: election.candidates },
  }).exec();

  if (!election) {
    notFound();
  }

  return (
    <div className="w-3/4 md:w-1/2 flex flex-col gap-6 items-center p-8">
      <h1>{election?.name}</h1>

      <PostForm election={election} />
      <CandidateForm
        election={election}
        candidates={JSON.parse(JSON.stringify(candidates))}
      />
      <AddVoters election={election} />
      <ConfirmElection id={election._id} />
      <StopElection id={election._id} />
      <DeleteElection id={election._id} />
    </div>
  );
}
