import { buildSchema } from "type-graphql";
import { RegisterResolver } from "../modules/user/Register";
import { LoginResolver } from "../modules/user/Login";
import { MeResolver } from "../modules/user/me";
import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { ChangePasswordResolver } from "../modules/user/ChangePassword";
import { LogoutResolver } from "../modules/user/Logout";
import { customAuthChecker } from "../authChecker";
import {
  CreateUserResolver,
  CreateProductResolver
} from "../modules/user/CreateUser";
import { ProfilePictureResolver } from "../modules/user/ProfilePicture";
import { logger } from "../middleware/logger";

export const createSchema = async () => {
  return buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      MeResolver,
      ConfirmUserResolver,
      ForgotPasswordResolver,
      ChangePasswordResolver,
      LogoutResolver,
      CreateUserResolver,
      CreateProductResolver,
      ProfilePictureResolver
    ],
    authChecker: customAuthChecker,
    globalMiddlewares: [logger]
  });
};
