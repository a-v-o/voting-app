"use server";
import dbConnect from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { del, put } from "@vercel/blob";
import { Admin, Candidate, Election, Voter } from "@/models/models";
import { Types } from "mongoose";
import { TVoter } from "@/utils/types";
import { checkAdminAccess, generateCode } from "@/utils/helpers";
import bcrypt from "bcrypt";
import { createSession, deleteSession, verifySession } from "@/utils/session";
import nodemailer from "nodemailer";

//done
export async function checkEligibility(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const electionCode = formdata.get("electionCode");
  const email = formdata.get("email");
  const code = formdata.get("code");
  // let requiredVoter;

  const election = await Election.findOne({ code: electionCode }).exec();

  if (!election) {
    return { message: "Election doesn't exist" };
  }

  const voters = await Voter.find({
    _id: { $in: election.eligibleVoters },
  }).exec();

  const voterIDs = voters.map((a) => a._id.toString());

  const requiredVoter: TVoter | null = await Voter.findOne({
    email: email,
  }).exec();

  if (
    requiredVoter == undefined ||
    voterIDs.includes(requiredVoter._id.toString()) == false
  ) {
    return { message: "You are not allowed to vote" };
  }

  if (requiredVoter.code != code) {
    return { message: "Code is invalid" };
  }

  if (requiredVoter.voted == true) {
    return { message: "You have already voted" };
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
  console.log(voterCode);

  await dbConnect();
  const election = await Election.findById(electionID)
    .populate("candidates")
    .exec();

  console.log(election);

  if (election.isLive == false) {
    return { message: "Election is not yet live" };
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
    return { message: "You have already voted" };
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

  console.log(postName);

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

//done
export async function createNewCandidate(
  prevState: { message: string } | undefined,
  formdata: FormData
) {
  await dbConnect();
  const postName = formdata.get("post") as string;
  const candidateName = formdata.get("candidate") as string;
  const electionName = formdata.get("election") as string;
  const candidatePicture = formdata.get("picture") as File;

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
    console.log(candidate);

    if (candidate.name.toLowerCase() == candidateName.toLowerCase()) {
      return { message: "Candidate already exists" };
    }
  }

  const newCandidate = new Candidate({
    post: postName,
    name: candidateName,
    votes: 0,
    image: blob.url,
  });

  await newCandidate.save();

  await Election.updateOne(
    { name: electionName },
    { $push: { candidates: { $each: [newCandidate._id] } } }
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
export async function addVoters(
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
  prevState: { message: string } | undefined
) {
  await dbConnect();
  const successfulMails = [];
  // const unsuccessfulMails = []

  const election = await Election.findById(electionId).exec();

  const transport = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "adejuwonvictor2004@gmail.com",
      pass: "noyj fzcz ibot tqfv"
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

  for (const voter of election.eligibleVoters) {
    const message = {
      from: "Voting App",
      to: "funmito2004@gmail.com",
      subject: `You are eligible to vote in ${election.name}`,
      text: `You are eligible to vote in the election ${election.name}. Your code is ${voter.code}. Please, keep it safe.`,
    };
    try {
      await transport.sendMail(message);
      successfulMails.push(voter.email);
    } catch (error) {
      // unsuccessfulMails.push(voter.email);
      console.error("Error sending email:", error);
      console.log(successfulMails);
      return { message: "Error sending emails to voters" };
    }
  }

  election.isLive = true;
  await election.save();
  redirect("/admin");
}

//done
export async function stopElection(
  electionId: Types.ObjectId,
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
  electionId: Types.ObjectId,
  prevState: { message: string } | undefined
) {
  await dbConnect();
  const imagesToDelete = [];
  const election = await Election.findById(electionId).exec();
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

  await del(imagesToDelete);
  await election.deleteOne().exec();
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
