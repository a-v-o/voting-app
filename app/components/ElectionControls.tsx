"use client";

import ConfirmElection from "./ConfirmElection";
import StopElection from "./StopElection";
import DeleteElection from "./DeleteElection";
import { Types } from "mongoose";
import { motion } from "motion/react";

export default function ElectionControls({
  id,
  duration,
  isLive
}: {
  id: Types.ObjectId;
  duration: number;
  isLive: boolean
}) {
  return (
    <motion.div
      layout
      transition={{
        duration: duration,
      }}
      className="w-min flex flex-col md:flex-row gap-4 justify-center items-center mt-8"
    >
      {isLive ? (<StopElection id={id} />) : (<ConfirmElection id={id} />)}
      <DeleteElection id={id} />
    </motion.div>
  );
}
