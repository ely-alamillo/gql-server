import { Connection } from "typeorm";
import faker from "faker";

import { gCall } from "../../../test-utils/gCall";
import { testConnection } from "../../../test-utils/testConnection";
import { User } from "../../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConnection();
});
afterAll(async () => {
  await conn.close();
});

const meQuery = `
 {
  me {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Me", () => {
  it("It gets a user's info.", async () => {
    const userInfo = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(8)
    };

    const user = await User.create({ ...userInfo }).save();

    const res = await gCall({
      source: meQuery,
      userId: user.id
    });

    expect(res).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email
        }
      }
    });
  });

  it("It fails to get user's info if not logged in.", async () => {
    const res = await gCall({
      source: meQuery
    });

    expect(res).toMatchObject({
      data: {
        me: null
      }
    });
  });
});
