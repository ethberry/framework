import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class LotteryTicketRule implements ValidatorConstraintInterface {
  validate(ticketNumbers: Array<boolean>, validationArguments: ValidationArguments) {
    return ticketNumbers.filter(e => e).length === validationArguments.constraints[0];
  }
}
