import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class LotteryTicketRule implements ValidatorConstraintInterface {
  validate(ticketNumbers: string, validationArguments: ValidationArguments) {
    const ticketNums: Array<number> = [];
    const valLen = validationArguments.constraints[0];
    const valMax = validationArguments.constraints[1];

    const numbers = ticketNumbers.substring(ticketNumbers.length - valLen * 2, ticketNumbers.length);

    for (let i = 0; i < valLen; i++) {
      const num = parseInt(numbers.substring(2 * i, 2 + 2 * i), 16);

      // each 2 bytes must be number 1 - 36
      if (num > 0 && num <= valMax) {
        ticketNums.push(num);
      }
    }

    // all numbers must be in order
    const isAscending = ticketNums.every(function (x, i) {
      return i === 0 || x >= ticketNums[i - 1];
    });

    return isAscending && ticketNums.length === valLen;
  }
}
