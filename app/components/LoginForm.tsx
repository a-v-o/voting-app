"use client";

import { cn } from "@/lib/utils";
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
import { useActionState } from "react";
import { checkEligibility } from "../actions/actions";

const initialState = {
  message: "",
};

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, pending] = useActionState(
    checkEligibility,
    initialState
  );
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and code below to cast your vote.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6 mb-4">
              <div className="grid gap-2">
                <Label htmlFor="electionCode">Election Code</Label>
                <Input
                  type="text"
                  name="electionCode"
                  id="electionCode"
                  required
                />
              </div>

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
                  <Label htmlFor="code">Login code</Label>
                </div>
                <Input
                  name="code"
                  id="code"
                  type="text"
                  placeholder="Code sent to your email"
                  className="placeholder:text-slate-500 placeholder:text-sm"
                  required
                />
              </div>
            </div>
            <p className="text-center text-red-600">{state?.message}</p>
            <Button type="submit" className="w-full" pending={pending}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
