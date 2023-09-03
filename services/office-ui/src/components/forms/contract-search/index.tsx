import { FC } from "react";
import { Grid } from "@mui/material";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { SelectInput } from "@gemunion/mui-inputs-core";
import type { IContractSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

interface IContractSearchFormProps {
  onSubmit: (values: IContractSearchDto) => Promise<void>;
  initialValues: IContractSearchDto;
  open: boolean;
  contractFeaturesOptions: Record<string, string>;
}

export const ContractSearchForm: FC<IContractSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractFeaturesOptions } = props;

  const { query, contractStatus, contractFeatures } = initialValues;
  const fixedValues = { query, contractStatus, contractFeatures };

  return (
    <CommonSearchForm initialValues={fixedValues} onSubmit={onSubmit} open={open} testId="ContractSearchForm">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SelectInput name="contractStatus" options={ContractStatus} multiple />
        </Grid>
        <Grid item xs={6}>
          <SelectInput
            name="contractFeatures"
            options={contractFeaturesOptions}
            multiple
            disabled={Object.keys(contractFeaturesOptions).length === 0}
          />
        </Grid>
      </Grid>
    </CommonSearchForm>
  );
};
