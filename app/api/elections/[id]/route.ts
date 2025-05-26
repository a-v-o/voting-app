import { Election } from "@/models/models";
import dbConnect from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  dbConnect();
  const { id } = await params;
  const res = await Election.findById(id);
  const election = res.toJSON();

  return Response.json({ election });
}
