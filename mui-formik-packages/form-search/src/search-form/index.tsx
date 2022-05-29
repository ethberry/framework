import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormikForm } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";

interface ICommonSearchFormProps {
  onSearch: (values: any) => void;
  initialValues: any;
  open?: boolean;
}

export const CommonSearchForm: FC<ICommonSearchFormProps> = props => {
  const { onSearch, initialValues, open = false, children } = props;

  const { query } = initialValues;
  const fixedValues = { query };

  return (
    <FormikForm initialValues={fixedValues} onSubmit={onSearch} showButtons={false} showPrompt={false}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <SearchInput name="query" data-testid="commonSearchInput" onSearch={onSearch} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </Collapse>
    </FormikForm>
  );
};
