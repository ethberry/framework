import { FC } from "react";

import { FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";

import { validationSchemaStatus } from "./validation";
import { IReferralProgramUpdateStatus } from "../../index";
import { ReferralProgramStatus } from "@framework/types";

export interface IReferralProgramStatusFormProps {
  onSubmit: (values: any, form?: any) => Promise<void>;
  initialValues: IReferralProgramUpdateStatus | null;
}

export const ReferralProgramStatusForm: FC<IReferralProgramStatusFormProps> = props => {
  const { initialValues, onSubmit } = props;

  if (!initialValues) {
    return null;
  }

  const { referralProgramStatus } = initialValues;
  const fixedValues = {
    referralProgramStatus,
  };

  return (
    <FormWrapper
      validationSchema={validationSchemaStatus}
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showPrompt={false}
      testId="ReferralProgramStatusForm"
    >
      <SelectInput name="referralProgramStatus" options={ReferralProgramStatus} />
    </FormWrapper>
  );
};
