import { FC } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import type { ISearchDto } from "@gemunion/types-collection";

interface IDropSearchFormProps {
  onSubmit: (values: ISearchDto) => Promise<void>;
  initialValues: ISearchDto;
  open: boolean;
}

export const DropSearchForm: FC<IDropSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const { query } = initialValues;
  const fixedValues = { query };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="DropSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
