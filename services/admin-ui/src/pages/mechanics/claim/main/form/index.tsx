import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { ClaimStatus, IClaimSearchDto } from "@framework/types";

interface IClaimSearchFormProps {
  onSubmit: (values: IClaimSearchDto) => Promise<void>;
  initialValues: IClaimSearchDto;
  open: boolean;
}

export const ClaimSearchForm: FC<IClaimSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { claimStatus, account } = initialValues;
  const fixedValues = { claimStatus, account };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="ClaimSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="account" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="claimStatus" options={ClaimStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
