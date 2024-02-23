import { FC } from "react";

import { Collapse, Grid } from "@mui/material";

import { AutoSave, /* FormWatcher, */ FormWrapper } from "@gemunion/mui-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EntityInput name="merchantIds" multiple controller="referral/tree" /* onChange={handleChange} */ />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
