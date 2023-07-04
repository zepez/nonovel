import { faker } from "@faker-js/faker";
import {
  db,
  user,
  profile,
  project,
  userProject,
  chapter,
  genre,
  projectGenre,
  type User,
  type Project,
} from "./index";

const SEED_GENRE_COUNT = 7;
const SEED_USER_COUNT = 5;
const SEED_CHAPTER_COUNT = 4;
const SEED_CHAPTER_SIZE = 15;

const createUser = () => {
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

const createProfile = (userId: User["id"], fullName: string) => {
  const firstName = fullName.split(" ")[0];
  const lastName = fullName.split(" ")[1];

  return {
    id: faker.string.uuid(),
    userId,
    username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
    bio: faker.lorem.sentences({ min: 3, max: 8 }),
    image: faker.image.avatar(),
  };
};

const createProject = () => {
  const name = faker.lorem.words({ min: 2, max: 7 });

  return {
    id: faker.string.uuid(),
    cover: faker.image.urlPicsumPhotos({ width: 400, height: 600 }),
    name,
    slug: faker.helpers.slugify(name),
    description: faker.lorem.sentences({ min: 2, max: 5 }),
  };
};

const linkUserProject = (userId: User["id"], projectId: Project["id"]) => {
  return {
    id: faker.string.uuid(),
    userId,
    projectId,
    role: "author",
    owner: true,
  } as const;
};

const createGenre = () => {
  const name = faker.lorem.words({ min: 1, max: 2 });

  return {
    id: faker.string.uuid(),
    name,
    slug: faker.helpers.slugify(name),
    description: faker.lorem.sentences({ min: 0, max: 2 }),
  } as const;
};

const linkProjectGenre = (
  projectId: Project["id"],
  allGenres: ReturnType<typeof createGenre>[]
) => {
  if (allGenres.length === 0)
    throw new Error("Defensive type error: No genres to link to project");

  const index = Math.floor(Math.random() * allGenres.length);
  const genre = allGenres[index];

  if (!genre) throw new Error("Defensive type error: No genre found");

  return {
    id: faker.string.uuid(),
    projectId,
    genreId: genre.id,
  } as const;
};

const createChapter = (projectId: Project["id"], order: number) => {
  const paragrpahs: string[] = [];
  for (let i = 0; i < SEED_CHAPTER_SIZE; i++) {
    paragrpahs.push(`<p>${faker.lorem.paragraph()}</p>`);
  }

  return {
    id: faker.string.uuid(),
    projectId,
    name: faker.lorem.words({ min: 2, max: 7 }),
    contentType: "html",
    content: paragrpahs.join("\n"),
    order: order.toString(),
  } as const;
};

const main = async () => {
  console.log("Seeding data...");

  await db.transaction(async (tx) => {
    // genre
    const allFakeGenres: ReturnType<typeof createGenre>[] = [];
    for (let i = 0; i < SEED_GENRE_COUNT; i++) {
      const fakeGenre = createGenre();
      allFakeGenres.push(fakeGenre);
      await tx.insert(genre).values(fakeGenre);
    }

    for (let i = 0; i < SEED_USER_COUNT; i++) {
      // user
      const fakeUser = createUser();
      await tx.insert(user).values(fakeUser);

      // profile
      const fakeProfile = createProfile(fakeUser.id, fakeUser.name);
      await tx.insert(profile).values(fakeProfile);

      // project
      const fakeProject = createProject();
      await tx.insert(project).values(fakeProject);

      // userProject
      const linkedUserProject = linkUserProject(fakeUser.id, fakeProject.id);
      await tx.insert(userProject).values(linkedUserProject);

      // projectGenre
      const linkedProjectGenres = linkProjectGenre(
        fakeProject.id,
        allFakeGenres
      );
      await tx.insert(projectGenre).values(linkedProjectGenres);

      // chapters
      for (let j = 0; j < SEED_CHAPTER_COUNT; j++) {
        const fakeChapter = createChapter(fakeProject.id, j + 1);
        await tx.insert(chapter).values(fakeChapter);
      }
    }
  });
};

void main();
