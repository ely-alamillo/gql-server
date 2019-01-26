import { Connection } from "typeorm";

import { gCall } from "../../../test-utils/gCall";
import { testConnection } from "../../../test-utils/testConnection";

let conn: Connection;
beforeAll(async () => {
  conn = await testConnection();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
  it("It creates a user.", async () => {
    console.log(
      await gCall({
        source: registerMutation,
        variableValues: {
          data: {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@test.com",
            password: "password"
          }
        }
      })
    );
  });
});
