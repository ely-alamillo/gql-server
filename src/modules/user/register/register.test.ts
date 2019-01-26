import { testConnection } from "../../../test-utils/testConnection";
import { Connection } from "typeorm";
import { gCall } from "../../../test-utils/gCall";

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
  test("It creates a user.", async () => {
    console.log("hellooooo");
    const res = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          firstName: "John",
          lastName: "Doee",
          email: "johndoe@test.com",
          password: "password"
        }
      }
    });
    console.log("end");
    console.log(JSON.stringify(res));
  });
});
