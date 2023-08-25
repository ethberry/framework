import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput, SwitchInput } from "@gemunion/mui-inputs-core";
import { CraftStatus, ICraftSearchDto } from "@framework/types";

interface ICraftSearchFormProps {
  onSubmit: (values: ICraftSearchDto) => Promise<void>;
  initialValues: ICraftSearchDto;
  open: boolean;
}

export const CraftSearchForm: FC<ICraftSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, craftStatus, inverse } = initialValues;
  const fixedValues = { query, craftStatus, inverse };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="ExchangeSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput multiple name="craftStatus" options={CraftStatus} />
          </Grid>
          <Grid item xs={6}>
            <SwitchInput name="inverse" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
