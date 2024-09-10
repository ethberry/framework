import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import type { IReferralProgramLevelDto } from "@framework/types";

@ValidatorConstraint()
export class RefProgramLevelsRule implements ValidatorConstraintInterface {
  validate(levels: Array<IReferralProgramLevelDto>) {
    if (!levels?.length) {
      return true;
    }
    const total = levels[0].share;
    const sum = levels.reduce((memo, current) => memo + current.share, 0);
    return sum === total * 2;
  }
}
