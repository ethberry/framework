import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { IVestingSearchDto } from "@framework/types";

interface IVestingSearchFormProps {
  onSubmit: (values: IVestingSearchDto) => Promise<void>;
  initialValues: IVestingSearchDto;
  open: boolean;
}

export const VestingSearchForm: FC<IVestingSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { account } = initialValues;
  const fixedValues = { account };

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
      <Collapse in={open}></Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
