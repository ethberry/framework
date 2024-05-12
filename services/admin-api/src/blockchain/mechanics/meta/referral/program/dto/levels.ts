import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import type { IReferralProgramLevelDto } from "../interfaces";

@ValidatorConstraint()
export class RefProgramLevelsRule implements ValidatorConstraintInterface {
  validate(levels: Array<IReferralProgramLevelDto>) {
    const total = levels[0].share;
    const sum = levels.reduce((partialSum, lev) => partialSum + lev.share, 0);
    return sum === total * 2;
  }
}
