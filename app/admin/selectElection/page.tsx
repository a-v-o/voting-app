import Search from "@/components/Search";
import { Admin, Election } from "@/models/models";
import dbConnect from "@/utils/db";
import { verifySession } from "@/utils/session";
import Link from "next/link";
import React from "react";

export default async function SelectElection({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  await dbConnect();
  const session = await verifySession();

  const admin = await Admin.findOne({
    email: session.email,
  });

  const isSupreme = admin.isSupreme;

  const allowedElectionsForAdmin = isSupreme
    ? await Election.find({}).exec()
    : await Election.find({
        _id: { $in: admin.allowedElections },
      }).exec();

  const { query } = await searchParams;
  const queriedElections = allowedElectionsForAdmin.filter((election) =>
    query
      ? election.name.toLowerCase().startsWith(query)
      : allowedElectionsForAdmin
  );
  return (
    <div className="w-full p-8 flex flex-col gap-8">
      <Search />
      {queriedElections.map((election) => {
        return (
          <Link
            className="ring-1 ring-black hover:bg-slate-100 p-2 rounded"
            href={`/admin/editElection/${election._id}`}
            key={election._id.toString()}
          >
            <p>{election.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
