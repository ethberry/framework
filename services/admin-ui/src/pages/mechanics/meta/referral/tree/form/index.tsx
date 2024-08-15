import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import type { ISearchDto } from "@gemunion/types-collection";
import { TextInput } from "@gemunion/mui-inputs-core";

export interface IReferralTreeSearchDto extends ISearchDto {
  referral: string;
  wallet: string;
  level: number;
  merchantIds: Array<number>;
}

interface IReferralTreeSearchFormProps {
  onSubmit: (values: IReferralTreeSearchDto) => Promise<void>;
  initialValues: IReferralTreeSearchDto;
  open: boolean;
}

export const ReferralTreeSearchForm: FC<IReferralTreeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, referral, wallet, merchantIds, level } = initialValues;
  const fixedValues = {
    query,
    referral,
    wallet,
    merchantIds,
    level,
  };

  return (
    <CommonSearchForm initialValues={fixedValues} onSubmit={onSubmit} open={open} testId="RefTreeSearchForm">
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <TextInput name="wallet" normalizeValue={(value: string | undefined) => value ?? ""} />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="referral" normalizeValue={(value: string | undefined) => value ?? ""} />
          </Grid>
        </Grid>
      </Collapse>
    </CommonSearchForm>
  );
};
