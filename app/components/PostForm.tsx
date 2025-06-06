"use client";

import { useActionState, useState } from "react";
import { createNewPost, deletePost } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { TElection } from "@/utils/types";
import { Input } from "./ui/input";
import { AnimatePresence, motion } from "motion/react";

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
    <div className="flex flex-col w-full gap-4">
      <Button
        className="mb-4 w-max self-center"
        onClick={() => {
          setHidden(!hidden);
        }}
        variant="outline"
      >
        Add Post
      </Button>

      <AnimatePresence>
        {!hidden && (
          <div className="flex flex-col gap-4 overflow-hidden">
            <motion.form
              initial={{ y: -150 }}
              animate={{ y: 0 }}
              exit={{ y: -150 }}
              transition={{
                ease: "easeOut",
              }}
              action={formAction}
              className="flex flex-col gap-2 w-full"
            >
              <Input type="hidden" name="election" value={election?.name} />
              <label htmlFor="post">Post:</label>
              <div className="flex items-center gap-2">
                <Input type="text" name="post" id="post" />
                <Button pending={pending}>Add</Button>
              </div>
            </motion.form>
            <p className="text-red-600 text-center m-4">{state?.message}</p>
          </div>
        )}
      </AnimatePresence>

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
                  <Button variant="destructive">Delete</Button>
                </div>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
