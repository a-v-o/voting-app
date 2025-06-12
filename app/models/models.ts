import mongoose, { models, Types } from "mongoose";

const { Schema, model } = mongoose;

const voterSchema = new Schema({
  email: String,
  code: String,
  voted: Boolean,
});

export const Voter = models.Voter || model("Voter", voterSchema);

const candidateSchema = new Schema({
  post: String,
  name: String,
  image: String,
  votes: Number,
  extraFields: [Object],
});

export const Candidate =
  models.Candidate || model("Candidate", candidateSchema);

const electionSchema = new Schema({
  isLive: Boolean,
  name: String,
  code: String,
  createdBy: Types.ObjectId,
  eligibleVoters: [{ type: Types.ObjectId, ref: Voter }],
  candidates: [{ type: Types.ObjectId, ref: Candidate }],
  posts: [String],
});

export const Election = models.Election || model("Election", electionSchema);

const adminSchema = new Schema({
  email: String,
  password: String,
  allowedToCreate: Boolean,
  allowedElections: [{ type: Types.ObjectId, ref: Election }],
  isSupreme: Boolean,
});

export const Admin = models.Admin || model("Admin", adminSchema);
