"use client";

import ConfirmElection from "./ConfirmElection";
import StopElection from "./StopElection";
import DeleteElection from "./DeleteElection";
import { Types } from "mongoose";
import { motion } from "motion/react";

export default function ElectionControls({
  id,
  duration,
}: {
  id: Types.ObjectId;
  duration: number;
}) {
  return (
    <motion.div
      layout
      transition={{
        duration: duration,
      }}
      className="w-min flex flex-col md:flex-row gap-4 justify-center items-center mt-8"
    >
      <ConfirmElection id={id} />
      <StopElection id={id} />
      <DeleteElection id={id} />
    </motion.div>
  );
}
