import VoterForm from "@/components/VoterForm";
import CandidateForm from "@/components/CandidateForm";
import { TElection } from "@/utils/types";
import PostForm from "@/components/PostForm";
import { notFound } from "next/navigation";
import { Candidate, Election, Voter } from "@/models/models";
import dbConnect from "@/utils/db";
import { Types } from "mongoose";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const voters = await Voter.find({
    _id: { $in: election.eligibleVoters },
  });

  if (!election) {
    notFound();
  }

  return (
    <div className="w-[90%] lg:w-2/3 flex flex-col gap-6 items-center p-4">
      <h1>{election?.name}</h1>
      <Tabs defaultValue="posts" className="w-full flex flex-col gap-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="voters">Voters</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <PostForm election={election} />
        </TabsContent>
        <TabsContent value="candidates">
          <CandidateForm
            election={election}
            candidates={JSON.parse(JSON.stringify(candidates))}
          />
        </TabsContent>
        <TabsContent value="voters">
          <VoterForm
            election={election}
            voters={JSON.parse(JSON.stringify(voters))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
