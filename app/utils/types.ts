import { Types } from "mongoose";

export type TAdmin = {
  _id: Types.ObjectId;
  email: string;
  password: string;
  allowedToCreate: boolean;
  allowedElections: Types.ObjectId[];
  isSupreme: boolean;
};

export type TVoter = {
  _id: Types.ObjectId;
  email: string;
  code: string;
  voted: boolean;
};

export type TCandidate = {
  _id: Types.ObjectId;
  post: string;
  name: string;
  image: string;
  votes: number;
  extraFields: Field[];
};

export type TElection = {
  _id: Types.ObjectId;
  code: string;
  isLive: boolean;
  name: string;
  createdBy: Types.ObjectId;
  eligibleVoters: TVoter;
  candidates: TCandidate[];
  posts: string[];
};

export type Entry = {
  [key: string]: string | number;
};

export type Chart = {
  [post: string]: Entry[];
};

export type Sheet = {
  [column: string]: string;
};

export type Field = {
  [key: string]: string | number;
};
