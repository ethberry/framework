import { FC } from "react";

import { FormWrapper } from "@gemunion/mui-form";

import { ReferralProgramLevelsInput } from "./levels";
import { IReferralProgramCreate } from "../index";
import { validationSchema } from "./validation";

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
    <FormWrapper
      validationSchema={validationSchema}
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showPrompt={false}
      testId="ReferralProgramForm"
    >
      <ReferralProgramLevelsInput />
    </FormWrapper>
  );
};