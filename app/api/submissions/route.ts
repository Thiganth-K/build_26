import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Submission, Team, Activity, Notification } from "@/models";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (teamId && teamId !== "all") filter.team = teamId;
    if (status && status !== "all") filter.status = status;
    if (type && type !== "all") filter.type = type;

    const submissions = await Submission.find(filter)
      .populate("team", "name code currentPhase progress")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ submissions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching submissions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const {
      teamId,
      day = 1,
      title,
      type,
      phase,
      fileUrl,
      fileName,
      fileSize,
      externalLink,
      githubUrl,
      demoUrl,
      presentationUrl,
      projectDescription,
      submittedByName,
      requiresMemberApproval = false,
    } = body;

    if (!teamId || !title) {
      return NextResponse.json({ error: "Team ID and title are required" }, { status: 400 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const dayNumber = Number(day) || 1;
    const isDay1PPT = dayNumber === 1 || requiresMemberApproval;
    const uploaderName = submittedByName || session?.name || "Participant";
    const uploaderEmail = session?.email?.toLowerCase() || "";

    // Check if an existing submission for this day already exists
    const existingSubmission = await Submission.findOne({ team: teamId, day: dayNumber });

    if (isDay1PPT) {
      // Build member approvals array for all team members
      const teamMembers = team.members || [];
      const memberApprovals = teamMembers.map((m: any) => {
        const isUploader =
          (uploaderEmail && m.email?.toLowerCase() === uploaderEmail) ||
          m.name?.toLowerCase() === uploaderName.toLowerCase();

        return {
          participant: m.participant,
          name: m.name,
          email: m.email,
          role: m.role || "Team Member",
          status: isUploader ? "APPROVED" : "PENDING",
          comment: isUploader ? "Uploaded & approved initial deliverable" : "",
          updatedAt: new Date(),
        };
      });

      // If team has only 1 member, it is automatically fully approved
      const allApproved =
        memberApprovals.length <= 1 ||
        memberApprovals.every((a: any) => a.status === "APPROVED");

      const submissionStatus = allApproved ? "Submitted" : "Pending Team Approval";
      const approvalStatus = allApproved ? "APPROVED" : "PENDING_APPROVAL";

      let submission;
      if (existingSubmission) {
        // Revision upload
        existingSubmission.title = title;
        existingSubmission.fileUrl = fileUrl || existingSubmission.fileUrl;
        existingSubmission.fileName = fileName || existingSubmission.fileName;
        existingSubmission.fileSize = fileSize || existingSubmission.fileSize;
        existingSubmission.externalLink = externalLink || existingSubmission.externalLink;
        existingSubmission.presentationUrl = presentationUrl || fileUrl || existingSubmission.presentationUrl;
        existingSubmission.projectDescription = projectDescription || existingSubmission.projectDescription;
        existingSubmission.version = (existingSubmission.version || 1) + 1;
        existingSubmission.uploadedByName = uploaderName;
        existingSubmission.uploadedByEmail = uploaderEmail;
        existingSubmission.requiresMemberApproval = true;
        existingSubmission.memberApprovals = memberApprovals;
        existingSubmission.status = submissionStatus;
        existingSubmission.approvalStatus = approvalStatus;

        await existingSubmission.save();
        submission = existingSubmission;
      } else {
        // Initial Day 1 PPT creation
        submission = await Submission.create({
          team: teamId,
          teamName: team.name,
          submittedByName: uploaderName,
          uploadedByName: uploaderName,
          uploadedByEmail: uploaderEmail,
          day: dayNumber,
          phase: phase || `Day 0${dayNumber}`,
          title,
          type: type || "Ideation PPT",
          fileUrl: fileUrl || "",
          fileName: fileName || "",
          fileSize: fileSize || "",
          externalLink: externalLink || "",
          githubUrl: githubUrl || "",
          demoUrl: demoUrl || "",
          presentationUrl: presentationUrl || fileUrl || "",
          projectDescription: projectDescription || "",
          status: submissionStatus,
          requiresMemberApproval: true,
          memberApprovals,
          approvalStatus,
          version: 1,
          scores: {
            problemUnderstanding: 0,
            innovation: 0,
            feasibility: 0,
            technicalApproach: 0,
            userImpact: 0,
          },
          totalScore: 0,
        });
      }

      // If fully approved, advance milestone
      if (allApproved) {
        const updatedMilestoneDay = Math.max(team.currentMilestoneDay || 1, Math.min(dayNumber + 1, 6));
        const newProgress = Math.min(100, Math.round((dayNumber / 6) * 100));

        await Team.findByIdAndUpdate(teamId, {
          currentMilestoneDay: updatedMilestoneDay,
          progress: Math.max(team.progress || 0, newProgress),
          lastActivityAt: new Date(),
          presentationUrl: presentationUrl || fileUrl || team.presentationUrl,
        });

        // Notify Evaluators
        await Notification.create({
          recipientRole: "ADMIN",
          type: "SUBMISSION",
          title: `Day 01 Submission: ${team.name}`,
          message: `${team.name} submitted ${title} (100% Team Consensus)`,
          link: "/admin/submissions",
        });
      } else {
        // Notify team members that PPT review is pending
        for (const member of teamMembers) {
          const isUploader =
            (uploaderEmail && member.email?.toLowerCase() === uploaderEmail) ||
            member.name?.toLowerCase() === uploaderName.toLowerCase();

          if (!isUploader) {
            await Notification.create({
              recipientRole: "PARTICIPANT",
              type: "SUBMISSION",
              title: `Day 01 PPT Approval Required: ${team.name}`,
              message: `${uploaderName} uploaded the Day 01 PPT ("${title}"). Please review and cast your vote!`,
              link: "/participant/milestones?day=1",
            });
          }
        }
      }

      // Activity log
      await Activity.create({
        type: "SUBMISSION_CREATED",
        title: `${uploaderName} ${existingSubmission ? "updated" : "uploaded"} Day 01 PPT (${title})`,
        description: allApproved
          ? `Team ${team.name} Day 01 deliverable approved and submitted.`
          : `Day 01 PPT staged by ${uploaderName}. Waiting for team member approval.`,
        teamId: team._id,
        teamName: team.name,
        participantName: uploaderName,
      });

      return NextResponse.json({ success: true, submission, allApproved });
    }

    // Days 2 to 6 standard flow
    let submission = existingSubmission;
    if (existingSubmission) {
      existingSubmission.title = title;
      existingSubmission.fileUrl = fileUrl || existingSubmission.fileUrl;
      existingSubmission.fileName = fileName || existingSubmission.fileName;
      existingSubmission.externalLink = externalLink || existingSubmission.externalLink;
      existingSubmission.githubUrl = githubUrl || existingSubmission.githubUrl;
      existingSubmission.demoUrl = demoUrl || existingSubmission.demoUrl;
      existingSubmission.presentationUrl = presentationUrl || existingSubmission.presentationUrl;
      existingSubmission.projectDescription = projectDescription || existingSubmission.projectDescription;
      existingSubmission.status = "Submitted";
      await existingSubmission.save();
    } else {
      submission = await Submission.create({
        team: teamId,
        teamName: team.name,
        submittedByName: uploaderName,
        day: dayNumber,
        phase: phase || `Day 0${dayNumber}`,
        title,
        type: type || `Day 0${dayNumber} Submission`,
        fileUrl: fileUrl || "",
        fileName: fileName || "",
        fileSize: fileSize || "",
        externalLink: externalLink || "",
        githubUrl: githubUrl || "",
        demoUrl: demoUrl || "",
        presentationUrl: presentationUrl || "",
        projectDescription: projectDescription || "",
        status: "Submitted",
        scores: {
          problemUnderstanding: 0,
          innovation: 0,
          feasibility: 0,
          technicalApproach: 0,
          userImpact: 0,
        },
        totalScore: 0,
      });
    }

    // Advance team milestone day and progress
    const updatedMilestoneDay = Math.max(team.currentMilestoneDay || 1, Math.min(dayNumber + 1, 6));
    const newProgress = Math.min(100, Math.round((dayNumber / 6) * 100));

    await Team.findByIdAndUpdate(teamId, {
      currentMilestoneDay: updatedMilestoneDay,
      progress: Math.max(team.progress || 0, newProgress),
      lastActivityAt: new Date(),
      ...(githubUrl ? { githubUrl } : {}),
      ...(demoUrl ? { demoUrl } : {}),
      ...(presentationUrl ? { presentationUrl } : {}),
    });

    // Activity log
    await Activity.create({
      type: "SUBMISSION_CREATED",
      title: `${uploaderName} submitted Day 0${dayNumber} (${title})`,
      description: `Team ${team.name} deliverable submitted for Day 0${dayNumber}`,
      teamId: team._id,
      teamName: team.name,
      participantName: uploaderName,
    });

    // Admin notification
    await Notification.create({
      recipientRole: "ADMIN",
      type: "SUBMISSION",
      title: `Day 0${dayNumber} Submission: ${team.name}`,
      message: `${team.name} submitted ${title}`,
      link: "/admin/submissions",
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error submitting deliverable";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    await connectToDatabase();
    const body = await req.json();

    const { id, status, reviewNotes, scores } = body;

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateObj: any = {
      reviewedByName: session?.name || "Bootcamp Evaluator",
      reviewedAt: new Date(),
    };

    if (status) updateObj.status = status;
    if (reviewNotes !== undefined) updateObj.reviewNotes = reviewNotes;

    if (scores) {
      updateObj.scores = scores;
      const total =
        (Number(scores.problemUnderstanding) || 0) +
        (Number(scores.innovation) || 0) +
        (Number(scores.feasibility) || 0) +
        (Number(scores.technicalApproach) || 0) +
        (Number(scores.userImpact) || 0);
      updateObj.totalScore = total;
    }

    const submission = await Submission.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    if (submission && submission.team) {
      // Activity
      await Activity.create({
        type: "SUBMISSION_REVIEWED",
        title: `Submission reviewed for ${submission.teamName}`,
        description: `Status: ${status || submission.status} • Total Score: ${submission.totalScore}/50`,
        teamId: submission.team,
        teamName: submission.teamName,
        participantName: session?.name,
      });

      // If approved, bump team progress
      if (status === "Approved") {
        await Team.findByIdAndUpdate(submission.team, {
          $inc: { progress: 15 },
          lastActivityAt: new Date(),
        });
      }

      // Notify participant
      await Notification.create({
        recipientRole: "PARTICIPANT",
        type: "SUBMISSION_REVIEWED",
        title: `Review updated: ${submission.title}`,
        message: `Your submission is ${status || submission.status}. Score: ${submission.totalScore}/50`,
        link: "/participant/submissions",
      });
    }

    return NextResponse.json({ success: true, submission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error reviewing submission";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
