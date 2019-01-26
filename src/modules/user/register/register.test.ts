import { testConnection } from "../../../test-utils/testConnection";
import { Connection } from "typeorm";
import { gCall } from "../../../test-utils/gCall";
import { GraphQLError } from "graphql";

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
    // const res = await
    gCall({
      source: registerMutation,
      variableValues: {
        data: {
          firstName: "John",
          lastName: "Doee",
          email: "johndoe@test.com",
          password: "password"
        }
      }
    })
      .then(r => console.log({ r }))
      .catch((e: GraphQLError) => console.log({ ...e }));
    // console.log(JSON.stringify(res));
  });
});
