"use client";

import { useActionState } from "react";
import { addAdmins } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { TAdmin, TElection } from "@/utils/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  message: "",
};

export default function AddAdmins({
  admin,
  elections,
}: {
  admin: TAdmin;
  elections: TElection[];
}) {
  const [state, formAction] = useActionState(addAdmins, initialState);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex">
        <form action={formAction} className="flex flex-col gap-2 w-full">
          <Label htmlFor="admins">Admin:</Label>
          <Input
            type="text"
            name="adminToAdd"
            id="adminToAdd"
            placeholder="Enter admin's email."
            className="p-2 placeholder:text-slate-500 placeholder:text-sm"
          />
          <Input type="hidden" name="admin" value={admin?.email} />
          <Select name="election">
            <SelectTrigger>
              <SelectValue placeholder="Choose election" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Elections</SelectLabel>
                {elections.map((election) => {
                  return (
                    <SelectItem
                      key={election.name}
                      value={election._id.toString()}
                    >
                      {election.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>Add</Button>
        </form>
      </div>
      <p className="text-red-600 text-center m-4">{state?.message}</p>
    </div>
  );
}
