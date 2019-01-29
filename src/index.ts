import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import queryComplexity, {
  fieldConfigEstimator,
  simpleEstimator
} from "graphql-query-complexity";

import { createSchema } from "./utils/createSchema";

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    formatError: formatArgumentValidationError,
    validationRules: [
      queryComplexity({
        // The maximum allowed query complexity, queries above this threshold will be rejected
        maximumComplexity: 10,
        // The query variables. This is needed because the variables are not available
        // in the visitor of the graphql-js library
        // bug in apollo server so we use empty object
        variables: {},
        // Optional callback function to retrieve the determined query complexity
        // Will be invoked weather the query is rejected or not
        // This can be used for logging or to implement rate limiting
        onComplete: (complexity: number) => {
          console.log("Query Complexity:", complexity);
        },
        estimators: [
          // Using fieldConfigEstimator is mandatory to make it work with type-graphql
          fieldConfigEstimator(),
          // This will assign each field a complexity of 1 if no other estimator
          // returned a value. We can define the default value for field not explicitly annotated
          simpleEstimator({
            defaultComplexity: 1
          })
        ]
      }) as any
    ]
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
