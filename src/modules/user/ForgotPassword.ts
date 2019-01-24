import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";
import { redis } from "../../redis";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../../entity/User";
import { forgotPasswordPrefix } from "../../constants/redisPrefixes";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // to prevent exposing if email exists
      return true;
    }

    const token = v4();

    await redis.set(token, user.id, "ex", 60 * 60 * 24);

    await sendEmail(
      forgotPasswordPrefix + email,
      `http:localhost:3000/user/change-password/${token}`
    );
    return true;
  }
}
