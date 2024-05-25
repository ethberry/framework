import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { getNestedValueFromObject } from "../utils/getNestedValue";

@ValidatorConstraint({ async: false })
class MaxLengthValidator implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const [relatedPropertyPath] = args.constraints;
    const object = args.object as any;
    const relatedValue = getNestedValueFromObject(object, relatedPropertyPath);

    return value <= relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyPath] = args.constraints;
    return `The value of $property must be less than or equal to the length of ${relatedPropertyPath}`;
  }
}

export function MaxPropertyValue(relatedPropertyPath: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [relatedPropertyPath],
      validator: MaxLengthValidator,
    });
  };
}
