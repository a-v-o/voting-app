import dbConnect from "@/utils/db";
import { Voter } from "@/models/models";

export async function GET() {
  await dbConnect();
  const firstVoter = await Voter.create({
    email: "email",
    code: "Code",
    voted: false,
  });

  return Response.json({ firstVoter });
}
