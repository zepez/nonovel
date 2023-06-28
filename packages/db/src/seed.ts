import { faker } from "@faker-js/faker";

const genUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    name: firstName + " " + lastName,
    email: faker.internet.email(firstName, lastName),
    emailVerified: faker.datatype.boolean(),
  };
};

const genProfile = () => ({
  id: faker.string.uuid(),
});

console.log("Seeding users...");

const user = genUser();
const profile = genProfile();

console.log({ user, profile });
