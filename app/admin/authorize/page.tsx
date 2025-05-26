import AuthorizeAdmins from "@/components/AuthorizeAdmins";
import { Admin } from "@/models/models";
import dbConnect from "@/utils/db";
import { verifySession } from "@/utils/session";

export default async function AuthorizeAdmin() {
  await dbConnect();
  const session = await verifySession();

  const admin = await Admin.findOne({
    email: session.email,
  });

  return (
    <div className="w-full h-full">
      {admin.isSupreme ? (
        <AuthorizeAdmins />
      ) : (
        <p>You cannot access this page.</p>
      )}
    </div>
  );
}
