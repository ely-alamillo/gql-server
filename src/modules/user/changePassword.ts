import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { redis } from "../../redis";
import { User } from "../../entity/User";
import { forgotPasswordPrefix } from "../../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data")
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    // findOne defualts to id
    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    redis.del(forgotPasswordPrefix + token);
    // we can also do user.update
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    // log use back in after changed pass
    ctx.req.session!.userId = user.id;

    return user;
  }
}
