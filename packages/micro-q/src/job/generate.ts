import { isNull } from "drizzle-orm";
import type { Job, DoneCallback } from "bull";
import { db } from "@nonovel/db";
import { qs } from "@nonovel/kv";

export const generateSearchJob = async (job: Job, done: DoneCallback) => {
  const { id: jobId } = job;
  let log = "";

  try {
    log = `${jobId}: starting generation search`;
    console.log(log);
    await job.log(log);

    const projectsWithoutCover = await db.query.project.findMany({
      where: (project) => isNull(project.cover),
    });

    log = `${jobId}: found ${projectsWithoutCover.length} projects without cover`;
    console.log(log);
    await job.log(log);

    for (const project of projectsWithoutCover) {
      log = `${jobId}: missing cover found: ${project.id}`;
      console.log(log);
      await job.log(log);
      await qs.genCover.add({ projectId: project.id });
    }

    done();
  } catch (error) {
    if (error instanceof Error) {
      log = `${jobId}: ${error.message ?? "error"}`;
      console.error(log);
      return done(new Error(log));
    }
  }
};
