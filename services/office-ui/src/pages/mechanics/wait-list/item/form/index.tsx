import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IWaitListItemSearchDto } from "@framework/types";

import { WaitListInput } from "./list-input";

interface IWaitListSearchFormProps {
  onSubmit: (values: IWaitListItemSearchDto) => Promise<void>;
  initialValues: IWaitListItemSearchDto;
  open: boolean;
}

export const WaitListSearchForm: FC<IWaitListSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { account, listIds, merchantId } = initialValues;
  const fixedValues = { account, listIds, merchantId };

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
          <Grid item xs={6}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
          <Grid item xs={6}>
            <WaitListInput />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
