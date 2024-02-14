import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { IReferralProgramLevelDto } from "../interfaces";

@ValidatorConstraint()
export class RefProgramLevelsRule implements ValidatorConstraintInterface {
  validate(levels: Array<IReferralProgramLevelDto>) {
    const total = levels[0].share;
    console.log("RefProgramLevelsRule_total", total);
    // const sum = [1, 2, 3].reduce((partialSum, a) => partialSum + a, 0);
    // console.log(sum); // 6

    const sum = levels.reduce((partialSum, lev) => partialSum + lev.share, 0);
    console.log("RefProgramLevelsRule_sum", sum);

    return sum === total * 2;
  }
}
