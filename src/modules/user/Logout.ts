import { Resolver, Mutation, Ctx } from "type-graphql";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((res, reject) => {
      ctx.req.session!.destroy(err => {
        if (err) {
          console.log({ err });
          reject(false);
        }
        ctx.res.clearCookie("uid");
        res(true);
      });
    });
  }
}
