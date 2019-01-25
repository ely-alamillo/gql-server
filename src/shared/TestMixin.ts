import { ClassType, Field, InputType } from "type-graphql";

export const TestMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class TestInput extends BaseClass {
    @Field()
    test: boolean;
  }
  return TestInput;
};
