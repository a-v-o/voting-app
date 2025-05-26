"use client";

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
import { adminLogin } from "@/actions/actions";
import Link from "next/link";
import { useActionState } from "react";

const initialState = {
  message: "",
};

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
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
            <div className="my-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signUp" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
            <p className="text-center text-red-600">{state?.message}</p>
            <Button type="submit" className="w-full">
              {pending ? "Submitting..." : "Proceed"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
