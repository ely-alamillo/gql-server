import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./emailAlreadyExists";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255, { message: "Firstname sucks" })
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "Email sucks" })
  email: string;

  @Field()
  password: string;
}
