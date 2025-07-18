"use server";
import dbConnect from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { del, put } from "@vercel/blob";
import { Admin, Candidate, Election, Voter } from "@/models/models";
import { Types } from "mongoose";
import { Field, Sheet, TVoter } from "@/utils/types";
import { checkAdminAccess, generateCode } from "@/utils/helpers";
import bcrypt from "bcrypt";
import { createSession, deleteSession, verifySession } from "@/utils/session";
import nodemailer from "nodemailer";
import * as XLSX from "xlsx";
import { TElection } from "../utils/types";

//done
export async function checkEligibility(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const electionCode = formdata.get("electionCode");
  const email = formdata.get("email");
  const code = formdata.get("code");

  const election = await Election.findOne({ code: electionCode }).exec();

  if (!election) {
    return { message: "Election doesn't exist" };
  }

  const requiredVoter: TVoter | null = await Voter.findOne({
    email: email,
    _id: { $in: election.eligibleVoters },
  }).exec();

  if (requiredVoter == undefined) {
    return { message: "You are not allowed to vote" };
  }

  if (requiredVoter.code != code) {
    return { message: "Code is invalid" };
  }

  if (requiredVoter.voted == true) {
    redirect(`/result/${election._id}`);
  }

  redirect(`/election/${election._id}?voterCode=${requiredVoter.code}`);
}

//done
export async function vote(
  electionID: Types.ObjectId,
  voterCode: string,
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  const date = new Date();
  await dbConnect();
  const election = await Election.findById(electionID)
    .populate("candidates")
    .exec();

  if (election.startTime > date) {
    return { message: "Election is not yet live" };
  }

  if (election.endTime < date) {
    return { message: "Election is over" };
  }

  if (!voterCode) {
    return { message: "You have to login to vote" };
  }

  const voters = await Voter.find({
    _id: { $in: election.eligibleVoters },
  }).exec();

  const voterIDs = voters.map((a) => a._id.toString());

  const voter = await Voter.findOne({ code: voterCode }).exec();

  if (voter == undefined || voterIDs.includes(voter._id.toString()) == false) {
    return { message: "You are not allowed to vote" };
  }

  if (voter.voted == true) {
    redirect(`/result/${election._id}`);
  }

  for (const vote of formdata.entries()) {
    const candidateVotedFor = vote[1];
    for (const candidate of election.candidates) {
      if (candidate._id.toString() == candidateVotedFor) {
        await Candidate.updateOne(
          { _id: candidate._id },
          { $inc: { votes: 1 } }
        );
        candidate.votes += 1;
      }
    }
  }
  await election.save();

  voter.voted = true;
  await voter.save();

  redirect(`/result/${election._id}`);
}

//done
export async function createNewPost(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const postName = formdata.get("post") as string;

  if (postName == "") {
    return { message: "Please enter a post" };
  }
  const electionName = formdata.get("election") as string;
  const election = await Election.findOne({
    name: electionName,
  }).exec();

  if (!checkAdminAccess(election)) {
    return { message: "You do not have the right to edit this election" };
  }

  for (const post of election.posts) {
    if (post.toLowerCase() == postName.toLowerCase()) {
      return { message: "Post already exists" };
    }
  }

  await Election.updateOne(
    { name: electionName },
    { $push: { posts: postName } }
  );
  revalidatePath(`/editElection/${election._id}`);
}

//done
export async function deletePost(formdata: FormData) {
  await dbConnect();
  const electionName = formdata.get("electionName");
  const postName = formdata.get("post");

  const election = await Election.findOne({ name: electionName }).exec();

  if (!checkAdminAccess(election)) {
    redirect("/adminLogin");
  }

  await Election.updateOne(
    { name: electionName },
    { $pull: { posts: postName } }
  );

  await Candidate.deleteMany({ post: postName });
  revalidatePath(`/editElection/${election._id}`);
}

export async function deleteVoter(formdata: FormData) {
  await dbConnect();
  const electionName = formdata.get("electionName");
  const voter = formdata.get("voter") as string;
  const voterId = new Types.ObjectId(voter);

  const election = await Election.findOne({ name: electionName }).exec();

  if (!checkAdminAccess(election)) {
    redirect("/adminLogin");
  }

  await Election.updateOne(
    { name: electionName },
    { $pull: { eligibleVoters: voterId } }
  );

  await Voter.deleteOne({ _id: voterId });
  revalidatePath(`/editElection/${election._id}`);
}

//done
export async function createNewCandidate(
  extraFields: string[],
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const postName = formdata.get("post") as string;
  const candidateName = formdata.get("candidate") as string;
  const electionName = formdata.get("election") as string;
  const candidatePicture = formdata.get("picture") as File;
  const extraFieldsArray = [];

  for (const field of extraFields) {
    const extraField: Field = {};
    const fieldValue = formdata.get(field) as string;
    extraField["name"] = field;
    extraField["value"] = fieldValue;
    extraFieldsArray.push(extraField);
  }

  if (!postName) {
    return { message: "Please select a post" };
  }

  if (candidateName == "") {
    return { message: "Please enter a name" };
  }

  if (candidatePicture.size == 0) {
    return { message: "Please select an image" };
  }

  const blob = await put(candidatePicture.name, candidatePicture, {
    access: "public",
    addRandomSuffix: true,
  });

  const election = await Election.findOne({
    name: electionName,
  }).exec();

  if (!checkAdminAccess(election)) {
    return { message: "You do not have the right to edit this election" };
  }

  const candidates = await Candidate.find({
    _id: { $in: election.candidates },
  }).exec();

  for (const candidate of candidates) {
    if (candidate.name.toLowerCase() == candidateName.toLowerCase()) {
      return { message: "Candidate already exists" };
    }
  }

  const newCandidate = new Candidate({
    post: postName,
    name: candidateName,
    votes: 0,
    image: blob.url,
    extraFields: extraFieldsArray,
  });

  await newCandidate.save();

  await Election.updateOne(
    { name: electionName },
    { $push: { candidates: newCandidate._id } }
  );

  revalidatePath(`/editElection/${election._id}`);
}

//done
export async function deleteCandidate(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const electionId = new Types.ObjectId(formdata.get("election") as string);
  const candidateId = new Types.ObjectId(formdata.get("candidate") as string);

  const election = await Election.findById(electionId).exec();
  const candidate = await Candidate.findById(candidateId).exec();

  if (!checkAdminAccess(election)) {
    return { message: "You cannot edit this election!" };
  }

  await Election.updateOne(
    { _id: electionId },
    { $pull: { candidates: { _id: candidateId } } }
  );

  await del(candidate.image);
  await Candidate.deleteOne({ _id: candidateId });
  revalidatePath(`/editElection/${election._id}`);
}

//done
export async function addVotersByText(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const voters = formdata.get("voters") as string;

  if (voters == "") {
    return { message: "Please enter at least one voter" };
  }

  const votersArray = voters.split(",");

  const electionName = formdata.get("election") as string;
  const election = await Election.findOne({ name: electionName }).exec();

  if (!checkAdminAccess(election)) {
    return { message: "You do not have the right to edit this election" };
  }

  for (const voter of votersArray) {
    const newVoter = new Voter({
      email: voter.trim().toLowerCase(),
      code: generateCode(9),
      voted: false,
    });
    await newVoter.save();
    election.eligibleVoters.push(newVoter._id);
  }

  await election.save();
  revalidatePath(`/editElection/${election._id}`);
}

//done
export async function addVotersByUpload(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const voterFile = formdata.get("voterFile") as File;

  if (voterFile.size == 0) {
    return { message: "Please upload a file" };
  }

  if (!voterFile.name.endsWith(".xlsx")) {
    return { message: "Please upload a valid .xlsx file" };
  }

  const electionName = formdata.get("election") as string;
  const election = await Election.findOne({ name: electionName }).exec();

  if (!checkAdminAccess(election)) {
    return { message: "You do not have the right to edit this election" };
  }

  const data = await voterFile.arrayBuffer();
  const workbook = XLSX.read(data);
  const parsedSheet: Sheet[] = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]],
    { header: "A" }
  );

  console.log(parsedSheet);

  for (const entry of parsedSheet) {
    const newVoter = new Voter({
      email: entry["A"].trim().toLowerCase(),
      code: generateCode(9),
      voted: false,
    });

    await newVoter.save();
    election.eligibleVoters.push(newVoter._id);
  }

  await election.save();
  revalidatePath(`/editElection/${election._id}`);
}

//done
export async function createElection(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();

  const session = await verifySession();

  const admin = await Admin.findOne({
    email: session.email,
  }).exec();

  const isAllowedToCreate = admin.allowedToCreate || admin.isSupreme;

  if (!isAllowedToCreate) {
    return {
      message:
        "Sorry, you cannot create elections. Contact the supreme being for access.",
    };
  }

  const electionName = formdata.get("electionName");
  const existingElection = await Election.findOne({ name: electionName });

  if (existingElection) {
    return { message: "Election already exists. Please, choose another name" };
  }

  const code = generateCode(8);

  const election = new Election({
    isLive: false,
    code: code,
    name: electionName,
    createdBy: admin._id,
  });

  await election.save();

  admin.allowedElections.push(election._id);

  await admin.save();

  redirect(`/admin/editElection/${election._id}`);
}

//done
export async function confirmElection(
  electionId: Types.ObjectId,
  date: Date | undefined,
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  const startTime = formdata.get("start-time");
  const endTime = formdata.get("end-time");
  const start = date?.toISOString().slice(0, 11).replace("T", `T${startTime}Z`);
  const end = date?.toISOString().slice(0, 11).replace("T", `T${endTime}Z`);

  if (!start || !end) {
    return { message: "Please enter a start and end time" };
  }

  const startDateTime = new Date(start);
  const endDateTime = new Date(end);

  if (startDateTime > endDateTime) {
    return { message: "Start time cannot be greater than end time" };
  }

  await dbConnect();

  const election: TElection = await Election.findById(electionId).exec();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS as string,
      pass: process.env.APP_PASSWORD as string,
    },
  });

  if (!checkAdminAccess(election)) {
    return { message: "You do not have the right to edit this election" };
  }

  if (election.candidates.length == 0) {
    return { message: "Add at least one candidate" };
  }

  if (election.eligibleVoters.length == 0) {
    return { message: "Add at least one voter" };
  }

  election.startTime = startDateTime;
  election.endTime = endDateTime;

  const voters = await Voter.find({
    _id: { $in: election.eligibleVoters },
  });

  for (const voter of voters) {
    const url = `https://voting-app-funmitos-projects.vercel.app/election/${election._id}?voterCode=${voter.code}`;
    const message = {
      from: process.env.OAUTH_USER as string,
      to: voter.email,
      subject: `${election.name.toUpperCase()} DETAILS`,
      text: `Hello, dear voter. Here are the details for the ${
        election.name
      }. Click on the link below to cast your votes: ${url}. The election code is ${
        election.code
      } and your code for this election is ${
        voter.code
      }. Please, keep it safe. The election starts by ${election.startTime.toUTCString()} and ends by ${election.endTime.toUTCString()} (UTC)`,
    };
    try {
      await transport.sendMail(message);
      voter.receivedMail = true;
      await voter.save();
    } catch (error) {
      console.error(`Error sending email to ${voter.email}`, error);
    }
  }

  election.isLive = true;
  await election.save();
  redirect("/admin");
}

export async function retryMail(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  const electionId = new Types.ObjectId(formdata.get("election") as string);

  const election = await Election.findById(electionId).exec();

  if (!election.isLive) {
    return { message: "Election isn't live." };
  }

  if (!checkAdminAccess(election)) {
    return { message: "You do not have the right to edit this election" };
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS as string,
      pass: process.env.APP_PASSWORD as string,
    },
  });

  const voters = await Voter.find({
    _id: { $in: election.eligibleVoters },
    receivedMail: false,
  });

  if (voters.length == 0) {
    return { message: "All voters have received their mail." };
  }

  for (const voter of voters) {
    const url = `https://voting-app-funmitos-projects.vercel.app/election/${election._id}?voterCode=${voter.code}`;
    const message = {
      from: process.env.OAUTH_USER as string,
      to: voter.email,
      subject: `${election.name.toUpperCase()} DETAILS`,
      text: `Hello, dear voter. Here are the details for the ${election.name}. Click on the link below to cast your votes: ${url}. The election code is ${election.code} and your code for this election is ${voter.code}. Please, keep it safe.`,
    };
    try {
      await transport.sendMail(message);
      voter.receivedMail = true;
      await voter.save();
    } catch (error) {
      console.error(`Error sending email to ${voter.email}`, error);
    }
  }
}

//done
export async function stopElection(
  electionId: Types.ObjectId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prevState: { message: string } | undefined
) {
  await dbConnect();
  const election = await Election.findById(electionId).exec();

  if (!checkAdminAccess(election)) {
    return { message: "You do not have the right to edit this election" };
  }

  if (election.isLive == false) {
    return { message: "Election isn't live yet!" };
  }

  election.isLive = false;
  await election.save();
  redirect("/admin");
}

//done
export async function deleteElection(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const electionId = formdata.get("electionId") as string;
  const id = new Types.ObjectId(electionId);
  const imagesToDelete = [];
  const election = await Election.findById(id).exec();
  const candidates = await Candidate.find({
    _id: { $in: election.candidates },
  }).exec();

  for (const candidate of candidates) {
    imagesToDelete.push(candidate.image);
  }

  if (!checkAdminAccess(election)) {
    return { message: "You do not have the right to edit this election" };
  }

  if (election.isLive == true) {
    return { message: "You cannot delete a live election" };
  }

  await Candidate.deleteMany({
    _id: { $in: election.candidates },
  });

  await Voter.deleteMany({
    _id: { $in: election.eligibleVoters },
  });

  if (imagesToDelete.length > 0) await del(imagesToDelete);
  await Election.findByIdAndDelete(id).exec();
  redirect("/admin");
}

export async function signUp(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const adminEmail = formdata.get("email") as string;
  const pwd = formdata.get("password") as string;

  if (adminEmail == "" || pwd == "") {
    return { message: "Invalid credentials" };
  }

  const existingAdmin = await Admin.findOne({
    email: adminEmail,
  });

  if (existingAdmin) {
    return { message: "Admin already exists." };
  }
  const hashedPassword = await bcrypt.hash(pwd, 10);

  // console.log(typeof hashedPassword);

  const admin = new Admin({
    email: adminEmail,
    password: hashedPassword,
    allowedToCreate: false,
    isSupreme: false,
  });

  await admin.save();

  await createSession(adminEmail);
}

export async function becomeSupreme(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  const adminEmail = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  await dbConnect();

  const admin = await Admin.findOne({ email: adminEmail }).exec();
  if (password == process.env.MASTER_KEY) {
    admin.isSupreme = true;
  } else {
    return { message: "You are not worthy!" };
  }
  await admin.save();
  redirect("/admin");
}

export async function adminLogin(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  const adminEmail = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  await dbConnect();

  const admin = await Admin.findOne({ email: adminEmail }).exec();
  const match = await bcrypt.compare(password, admin.password);

  if (match) {
    await createSession(adminEmail);
  } else {
    return { message: "Wrong email or password" };
  }
}

export async function addAdmins(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const adminEmail = formdata.get("admin") as string;
  const adminToAdd = formdata.get("adminToAdd") as string;
  const electionIdString = formdata.get("election") as string;
  const electionId = new Types.ObjectId(electionIdString);

  if (adminToAdd == "") {
    return { message: "Please choose an admin email" };
  }

  const election = await Election.findById(electionId).exec();
  console.log(election.createdBy);

  const admin = await Admin.findOne({ email: adminEmail }).exec();

  const newAdmin = await Admin.findOne({ email: adminToAdd }).exec();

  console.log(admin._id);

  if (!newAdmin) {
    return {
      message: "The admin needs to sign up before access can be given.",
    };
  }

  if (
    election.createdBy.toString() == admin._id.toString() ||
    admin.isSupreme == true
  ) {
    newAdmin.allowedElections.push(electionId);
    await newAdmin.save();
  } else {
    return {
      message: "Only the admin who created this election can add other admins",
    };
  }

  revalidatePath("/createElection");
}

export async function authorizeAdmin(formdata: FormData) {
  await dbConnect();
  const adminEmail = formdata.get("adminEmail");

  const admin = await Admin.findOne({
    email: adminEmail,
  });

  admin.allowedToCreate = true;

  await admin.save();
}

export async function logOut() {
  await deleteSession();
}
