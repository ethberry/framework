import { FC } from "react";
import { Grid, Collapse } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IWaitListItemSearchDto } from "@framework/types";

interface IWaitListSearchFormProps {
  onSubmit: (values: IWaitListItemSearchDto) => Promise<void>;
  initialValues: IWaitListItemSearchDto;
  open: boolean;
}

export const WaitListSearchForm: FC<IWaitListSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { account, listIds } = initialValues;
  const fixedValues = { account, listIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="WaitListSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="account" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="listIds" controller="waitlist/list" multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
