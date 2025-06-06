import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
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
          <Button variant="outline" asChild key={election._id.toString()}>
            <Link href={`/admin/editElection/${election._id}`}>
              <p>{election.name}</p>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
