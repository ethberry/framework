import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { DismantleStatus, IDismantleSearchDto } from "@framework/types";

interface IDismantleSearchFormProps {
  onSubmit: (values: IDismantleSearchDto) => Promise<void>;
  initialValues: IDismantleSearchDto;
  open: boolean;
}

export const DismantleSearchForm: FC<IDismantleSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, dismantleStatus } = initialValues;
  const fixedValues = { query, dismantleStatus };

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
          <Grid item xs={12}>
            <SelectInput multiple name="dismantleStatus" options={DismantleStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
