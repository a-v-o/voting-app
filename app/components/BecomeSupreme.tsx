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
import { becomeSupreme } from "@/actions/actions";
import { useActionState } from "react";
import { LoaderIcon } from "lucide-react";

const initialState = {
  message: "",
};

export default function BecomeSupreme() {
  const [state, formAction, pending] = useActionState(
    becomeSupreme,
    initialState
  );
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to become the supreme being
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
                  <Label htmlFor="password">Secret Key</Label>
                </div>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Time to test your mettle."
                  required
                />
              </div>
            </div>
            <p className="text-center text-red-600">{state?.message}</p>
            <Button type="submit" className="w-full mt-4">
              {pending ? (
                <div className="animate-spin">
                  <LoaderIcon />
                </div>
              ) : (
                "Proceed"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
