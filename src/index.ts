import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";

import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/me";
import { customAuthChecker } from "./authChecker";
import { ConfirmUserResolver } from "./modules/user/confirmUser";
import { ForgotPasswordResolver } from "./modules/user/ForgotPassword";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      MeResolver,
      ConfirmUserResolver,
      ForgotPasswordResolver
    ],
    authChecker: customAuthChecker
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
    formatError: formatArgumentValidationError
  });

  const app = Express();
  const RedisStore = connectRedis(session);

  // middleware

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
