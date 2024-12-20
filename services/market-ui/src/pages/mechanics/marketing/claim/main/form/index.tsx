import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import type { IClaimSearchDto } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

import { FormRefresher } from "../../../../../../components/forms/form-refresher";

interface IClaimSearchFormProps {
  onSubmit: (values: IClaimSearchDto) => Promise<void>;
  initialValues: IClaimSearchDto;
  open: boolean;
  onRefreshPage: () => Promise<void>;
}

export const ClaimSearchForm: FC<IClaimSearchFormProps> = props => {
  const { onSubmit, initialValues, open, onRefreshPage } = props;

  const { account, claimStatus, claimType } = initialValues;
  const fixedValues = { account, claimStatus, claimType };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="ClaimSearchForm"
    >
      <FormRefresher onRefreshPage={onRefreshPage} />
      <Collapse in={open}>
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput multiple name="claimStatus" options={ClaimStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="claimType" options={ClaimType} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
