import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { IVestingSearchDto, VestingContractTemplate } from "@framework/types";

interface IVestingSearchFormProps {
  onSubmit: (values: IVestingSearchDto) => Promise<void>;
  initialValues: IVestingSearchDto;
  open: boolean;
}

export const VestingSearchForm: FC<IVestingSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { account, contractTemplate } = initialValues;
  const fixedValues = { account, contractTemplate };

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
            <SelectInput name="contractTemplate" options={VestingContractTemplate} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
