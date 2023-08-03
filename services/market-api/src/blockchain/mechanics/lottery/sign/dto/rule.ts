import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class LotteryTicketRule implements ValidatorConstraintInterface {
  validate(ticketNumbers: string, validationArguments: ValidationArguments) {
    const ticketNums: Array<number> = [];
    for (let i = 0; i < 6; i++) {
      const num = Number(
        ticketNumbers.substring(ticketNumbers.length - 12, ticketNumbers.length).substring(2 * i, 2 + 2 * i),
      );
      // each 2 bytes must be number 1 - 99
      if (num > 0 && num <= 99) ticketNums.push(num);
    }
    // numbers must be isAscending order
    ticketNums.every(function (x, i) {
      return i === 0 || x >= ticketNums[i - 1];
    });

    return ticketNums.length === validationArguments.constraints[0];
  }
}
