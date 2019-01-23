import { MyContext } from "./types/MyContext";
import { AuthChecker } from "type-graphql";

export const customAuthChecker: AuthChecker<MyContext> = ({
  context: { req }
}) => {
  if (req.session!.userId) {
    return true;
  }
  return false;

  //   or
  //   return !!req.session.userId;
};
