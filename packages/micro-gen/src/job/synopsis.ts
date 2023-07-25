import { eq } from "drizzle-orm";
import type { Job, DoneCallback } from "bull";
import { db, project as projectTable } from "@nonovel/db";
import { promptText } from "../prompt";

export const generateSynopsisJob = async (
  job: Job<{
    projectId: string;
  }>,
  done: DoneCallback
) => {
  const { id: jobId } = job;
  let log = "";

  try {
    const { projectId } = job.data;

    const project = await db.query.project.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    log = `${jobId}: project found with id: ${projectId}`;
    console.log(log);
    await job.log(log);

    if (!project)
      return done(new Error(`project not found with id: ${projectId}`));

    if (!project.penName)
      return done(
        new Error(`project does not have a penName with id: ${projectId}`)
      );

    await job.progress(30);

    const synopsis = await promptText(
      `Please generate a short, spoiler-free synopsis for ${project.name} by ${project.penName}`
    );

    log = `${jobId}: generated synopsis for project with id: ${projectId}`;
    console.log(log);
    await job.log(log);

    await job.progress(75);

    await db
      .update(projectTable)
      .set({
        description: synopsis,
      })
      .where(eq(projectTable.id, projectId));

    await job.progress(100);

    log = `${jobId}: updated project with synopsis, ${projectId}`;
    console.log(log);
    await job.log(log);

    return done();
  } catch (error) {
    if (error instanceof Error) {
      log = `${jobId}: ${error.message ?? "error"}`;
      console.error(error);
      return done(error);
    }
  }
};
