import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { User } from "../../../entity/user";

@ValidatorConstraint({ async: true })
export class EmailAlreadyExistsConstraint
  implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ where: { email } }).then(user => {
      if (user) {
        return false;
      }
      return true;
    });
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  // tslint:disable-next-line
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailAlreadyExistsConstraint
    });
  };
}
