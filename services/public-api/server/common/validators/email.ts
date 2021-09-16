import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { reEmail } from "@gemunion/constants";

interface IEmailConstraints {
  required: boolean;
  regexp: RegExp;
  minLength: number;
  maxLength: number;
}

@ValidatorConstraint({ async: true })
export class ValidateEmail implements ValidatorConstraintInterface {
  private reason: string;

  public validate(value: unknown, args: ValidationArguments): boolean {
    this.reason = this.isValid(value, args);
    return !this.reason;
  }

  public defaultMessage(): string {
    return this.reason;
  }

  private isValid(value: unknown, args: ValidationArguments): string {
    const { required = true, regexp = reEmail, minLength, maxLength }: IEmailConstraints = args.constraints[0];

    if (typeof value === "undefined" || value === "") {
      if (required) {
        return "valueMissing";
      } else {
        return "";
      }
    }

    if (typeof value !== "string") {
      return "typeMismatch";
    }

    if (typeof minLength !== "undefined" && value.length < minLength) {
      return "tooShort";
    }

    if (typeof maxLength !== "undefined" && value.length > maxLength) {
      return "tooLong";
    }

    if (regexp && !regexp.test(value)) {
      return "patternMismatch";
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
