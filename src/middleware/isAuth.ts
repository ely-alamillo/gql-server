import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new Error("You are not authy");
  }
  return next();
};
