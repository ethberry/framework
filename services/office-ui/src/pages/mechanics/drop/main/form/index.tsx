import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IDropSearchDto } from "@framework/types";

interface IDropSearchFormProps {
  onSubmit: (values: IDropSearchDto) => Promise<void>;
  initialValues: IDropSearchDto;
  open: boolean;
}

export const DropSearchForm: FC<IDropSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, merchantId } = initialValues;
  const fixedValues = { query, merchantId };

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
