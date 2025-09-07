// import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default async function Home() {
  return (
    <Card className="w-4/5 md:w-1/2 lg:w-1/3 mx-auto mt-20">
      <CardHeader>
        <CardTitle>Voting Portal.</CardTitle>
        <CardDescription>
          Welcome to the voting portal. Login to continue.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/login">
          <Button variant="outline" className="text-sm">
            Login to vote
          </Button>
        </Link>
        <Link href="/admin">
          <Button className="text-sm">Login as admin</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
