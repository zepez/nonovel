import { faker } from "@faker-js/faker";
import { db, user, profile, project, chapter, type Chapter } from "./index";

const SEED_USER_COUNT = 5;
const SEED_CHAPTER_COUNT = 4;

const genUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const verified = faker.datatype.boolean();

  return {
    id: faker.string.uuid(),
    name: firstName + " " + lastName,
    email: faker.internet.email({ firstName, lastName }),
    emailVerified: verified ? faker.date.past() : null,
  };
};

const genProfile = (user: ReturnType<typeof genUser>) => {
  const firstName = user.name.split(" ")[0];
  const lastName = user.name.split(" ")[1];

  return {
    id: faker.string.uuid(),
    userId: user.id,
    username: faker.internet.userName({ firstName, lastName }),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
  };
};

const genProject = () => {
  const name = faker.lorem.words(3);

  return {
    id: faker.string.uuid(),
    name,
    slug: faker.helpers.slugify(name),
    description: faker.lorem.sentence(),
  };
};

const genChapter = (project: ReturnType<typeof genProject>, order: number) => {
  const paragrpahs: string[] = [];
  for (let i = 0; i < 3; i++) {
    paragrpahs.push(`<p>${faker.lorem.paragraph()}</p>`);
  }

  return {
    id: faker.string.uuid(),
    projectId: project.id,
    name: faker.lorem.words(5),
    contentType: "html",
    content: paragrpahs.join("\n"),
    order,
  };
};

const main = async () => {
  console.log("Seeding data...");

  const generatedUsers: ReturnType<typeof genUser>[] = [];
  const generatedProfiles: ReturnType<typeof genProfile>[] = [];
  const generatedProjects: ReturnType<typeof genProject>[] = [];
  const generatedChapters: ReturnType<typeof genChapter>[] = [];

  for (let i = 0; i < SEED_USER_COUNT; i++) {
    const generatedUser = genUser();
    generatedUsers.push(generatedUser);

    const generatedProfile = genProfile(generatedUser);
    generatedProfiles.push(generatedProfile);

    const generatedProject = genProject();
    generatedProjects.push(generatedProject);

    for (let j = 0; j < SEED_CHAPTER_COUNT; j++) {
      const generatedChapter = genChapter(generatedProject, j + 1);
      generatedChapters.push(generatedChapter);
    }
  }

  await db.transaction(async (tx) => {
    await tx.insert(user).values(generatedUsers);
    await tx.insert(profile).values(generatedProfiles);
    await tx.insert(project).values(generatedProjects);

    // TODO: typescript is claiming projectId doesn't exist on the type. Not sure why.
    await tx.insert(chapter).values(generatedChapters as unknown as Chapter[]);
  });
};

void main();
