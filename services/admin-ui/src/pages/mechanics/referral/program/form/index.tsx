import { FC } from "react";

import { FormWrapper } from "@gemunion/mui-form";

import { ReferralProgramLevelsInput } from "./levels";
import { IReferralProgramCreate } from "../index";

export interface IReferralProgramFormProps {
  onSubmit: (values: any, form?: any) => Promise<void>;
  initialValues: IReferralProgramCreate | null;
}

export const ReferralProgramForm: FC<IReferralProgramFormProps> = props => {
  const { initialValues, onSubmit } = props;

  if (!initialValues) {
    return null;
  }

  const { levels } = initialValues;
  const fixedValues = {
    levels,
  };

  return (
    <FormWrapper initialValues={fixedValues} onSubmit={onSubmit} testId="ReferralProgramForm">
      <ReferralProgramLevelsInput />
    </FormWrapper>
  );
};
