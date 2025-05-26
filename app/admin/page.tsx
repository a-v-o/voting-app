import dbConnect from "@/utils/db";
import { Election } from "@/models/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {
  await dbConnect();
  const allElections = await Election.find({}).exec();
  const activeElections = await Election.find({
    isLive: true,
  }).exec();

  return (
    <div className="w-full grid md:grid-cols-3 gap-4 h-fit p-8">
      <Card>
        <CardHeader>
          <CardTitle>All Elections</CardTitle>
        </CardHeader>
        <CardContent className="font-bold text-3xl">
          {allElections.length}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Elections</CardTitle>
        </CardHeader>
        <CardContent className="font-bold text-3xl">
          {activeElections.length}
        </CardContent>
      </Card>
    </div>
  );
}
