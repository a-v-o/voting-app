import AddAdmins from "@/components/AddAdmins";
import { Admin, Election } from "@/models/models";
import dbConnect from "@/utils/db";
import { verifySession } from "@/utils/session";

export default async function AddAdmin() {
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

  return (
    <AddAdmins
      admin={JSON.parse(JSON.stringify(admin))}
      elections={JSON.parse(JSON.stringify(allowedElectionsForAdmin))}
    />
  );
}
