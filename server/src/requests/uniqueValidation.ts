import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { getDatasource } from "../database";
import { User } from "../entity/user";

@ValidatorConstraint({ async: true })
export class NonUniqueEmailConstraint implements ValidatorConstraintInterface {
  async validate(email: any, args: ValidationArguments) {
    const dataSource = await getDatasource();
    const user = await dataSource.manager
      .getRepository(User)
      .findOneBy({ email: email });
    if (user) {
      return false;
    } else {
      return true;
    }
  }
}

export function UniqueEmail(validationOptions?: ValidationOptions) {
  validationOptions = {
    ...{ message: "$value already exists. Do you already have an account?" },
    ...validationOptions,
  };
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NonUniqueEmailConstraint,
    });
  };
}
