"use client";

import { useActionState, useState } from "react";
import { createNewPost, deletePost } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { TElection } from "@/utils/types";
import { Input } from "./ui/input";
import { LoaderIcon } from "lucide-react";

const initialState = {
  message: "",
};

export default function PostForm({ election }: { election: TElection }) {
  const [hidden, setHidden] = useState(true);
  const [state, formAction, pending] = useActionState(
    createNewPost,
    initialState
  );

  return (
    <div className="flex flex-col w-full">
      <Button
        className="mb-4"
        onClick={() => {
          setHidden(!hidden);
        }}
      >
        Add Post
      </Button>

      <div className={hidden ? "hidden" : "flex flex-col gap-4"}>
        <form action={formAction} className="flex flex-col gap-2 w-full">
          <label htmlFor="post">Post:</label>
          <Input type="text" name="post" id="post" />
          <Input type="hidden" name="election" value={election?.name} />
          <Button>
            {pending ? (
              <div className="animate-spin">
                <LoaderIcon />
              </div>
            ) : (
              "Add"
            )}
          </Button>{" "}
        </form>
        <p className="text-red-600 text-center m-4">{state?.message}</p>
      </div>

      <div>
        <h2>Posts:</h2>
        <div className="flex flex-col gap-4">
          {election.posts.map((post, index) => {
            return (
              <form key={post} action={deletePost}>
                <div className="flex justify-between items-center gap-3">
                  <p>{index + 1}</p>
                  <p>{post}</p>
                  <Input type="hidden" name="post" id={post} value={post} />
                  <Input
                    type="hidden"
                    name="electionName"
                    value={election.name}
                  />
                  <Button>Delete</Button>
                </div>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
