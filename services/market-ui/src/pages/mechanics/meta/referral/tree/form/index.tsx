import { FC } from "react";
import { Collapse } from "@mui/material";

import { AutoSave, FormWrapper } from "@ethberry/mui-form";
import { EntityInput } from "@ethberry/mui-inputs-entity";

import { IReferralTreeSearchDto } from "../index";

export interface IReferralTreeMerchantSearchDto {
  merchantIds: Array<number>;
}

interface IReferralTreeMerchantSearchFormProps {
  onSubmit: (values: IReferralTreeSearchDto) => Promise<void>;
  initialValues: IReferralTreeMerchantSearchDto;
  open: boolean;
}

export const ReferralTreeMerchantSearchForm: FC<IReferralTreeMerchantSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { merchantIds } = initialValues;
  const fixedValues = { merchantIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="ReferralTreeMerchantSearchForm"
    >
      <Collapse in={open}>
        <EntityInput name="merchantIds" multiple controller="referral/tree" />
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
