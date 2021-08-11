import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import {Injectable} from "@nestjs/common";
import {Not} from "typeorm";

import {IUser} from "@gemunionstudio/framework-types";
import {CustomValidation, NativeValidation} from "@gemunionstudio/types-validation";

import {UserService} from "../../user/user.service";

interface IEmailConstraints {
  required: boolean;
  unique: boolean;
  regexp: RegExp;
  minLength: number;
  maxLength: number;
}

@Injectable()
@ValidatorConstraint({async: true})
export class ValidateEmail implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  private reason: string;

  public async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    this.reason = await this.isValid(value, args);
    return !this.reason;
  }

  public defaultMessage(): string {
    return this.reason;
  }

  private async isValid(value: unknown, args: ValidationArguments): Promise<string> {
    const {required = true, regexp, unique, minLength, maxLength}: IEmailConstraints = args.constraints[0];

    if (typeof value === "undefined" || value === "") {
      if (required) {
        return NativeValidation.valueMissing;
      } else {
        return "";
      }
    }

    if (typeof value !== "string") {
      return NativeValidation.typeMismatch;
    }

    if (typeof minLength !== "undefined" && value.length < minLength) {
      return NativeValidation.tooShort;
    }

    if (typeof maxLength !== "undefined" && value.length > maxLength) {
      return NativeValidation.tooLong;
    }

    if (regexp && !regexp.test(value)) {
      return NativeValidation.patternMismatch;
    }

    const userId = (args.object as IUser).id;

    if (unique) {
      const where = {email: value};
      if (userId) {
        Object.assign(where, {
          id: Not(userId),
        });
      }
      const entity = await this.userService.findOne(where);
      if (entity) {
        return CustomValidation.duplicate;
      }
    }

    return "";
  }
}

export function IsEmail(constraints: Partial<IEmailConstraints> = {}, validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: "IsEmail",
      target: object.constructor,
      propertyName,
      constraints: [constraints],
      options: validationOptions,
      validator: ValidateEmail,
    });
  };
}
