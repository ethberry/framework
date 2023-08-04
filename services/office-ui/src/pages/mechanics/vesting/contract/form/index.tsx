import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IVestingSearchDto } from "@framework/types";

interface IVestingSearchFormProps {
  onSubmit: (values: IVestingSearchDto) => Promise<void>;
  initialValues: IVestingSearchDto;
  open: boolean;
}

export const VestingSearchForm: FC<IVestingSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { account, merchantId } = initialValues;
  const fixedValues = { account, merchantId };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="VestingSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="account" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
