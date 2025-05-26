"use client";

import { signUp } from "@/actions/actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  message: "",
};

export default function Page() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Enter your email below to sign up.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input name="password" id="password" type="password" required />
              </div>
            </div>
            <p className="text-center text-red-600">{state?.message}</p>
            <Button type="submit" className="w-full mt-4">
              {pending ? "Submitting..." : "Proceed"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
