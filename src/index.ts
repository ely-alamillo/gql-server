import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";

import { createSchema } from "./utils/createSchema";

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    formatError: formatArgumentValidationError
  });

  const app = Express();
  const RedisStore = connectRedis(session);

  // middleware

  app.use(Express.json());
  app.use(
    cors({
      origin: "http://localhost:4000",
      credentials: true
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "uid",
      secret: "this is a secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365
      }
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
