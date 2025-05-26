import { Admin } from "@/models/models";
import { verifySession } from "./session";
import { TElection } from "./types";

export function generateCode(length: number) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export async function checkAdminAccess(election: TElection) {
  const payload = await verifySession();
  const admin = await Admin.findOne({
    email: payload.email,
  });

  if (
    admin.allowedElections.includes(election._id) ||
    admin.isSupreme == true
  ) {
    return true;
  } else {
    return false;
  }
}
