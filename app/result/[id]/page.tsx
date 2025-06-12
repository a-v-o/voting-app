// "use client"
import { Candidate, Election } from "@/models/models";
import dbConnect from "@/utils/db";
import { Chart, Entry, TElection } from "@/utils/types";
import { Types } from "mongoose";

// import Image from "next/image";
import { notFound } from "next/navigation";
import ResultChart from "../../components/ResultChart";

export default async function Page({
  params,
}: {
  params: Promise<{ id: Types.ObjectId }>;
}) {
  dbConnect();
  const { id } = await params;
  const election: TElection = await Election.findById(id).exec();

  if (!election) {
    notFound();
  }

  const chartData: Chart[] = [];

  const candidates = await Candidate.find({
    _id: { $in: election.candidates },
  }).exec();

  const posts = election.posts;

  for (const post of posts) {
    const chart: Chart = {};
    chart[post] = [];

    for (const candidate of candidates) {
      if (post == candidate.post) {
        const entry: Entry = {};
        entry["name"] = candidate.name;
        entry["votes"] = candidate.votes;
        chart[post].push(entry);
      }
    }
    chartData.push(chart);
  }
  // console.log(chartData[0]);

  return (
    <div className="w-full">
      <ResultChart chartData={chartData} />
    </div>
  );
}
