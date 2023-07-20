import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { GradeStatus, IGradeSearchDto } from "@framework/types";

interface IGradeSearchFormProps {
  onSubmit: (values: IGradeSearchDto) => Promise<void>;
  initialValues: IGradeSearchDto;
  open: boolean;
}

export const GradeSearchForm: FC<IGradeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, gradeStatus } = initialValues;
  const fixedValues = { query, gradeStatus };

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
            <SelectInput multiple name="gradeStatus" options={GradeStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
