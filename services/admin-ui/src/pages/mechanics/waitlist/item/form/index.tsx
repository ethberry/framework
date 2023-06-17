import { FC } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import type { IWaitListItemSearchDto } from "@framework/types";

interface IWaitListSearchFormProps {
  onSubmit: (values: IWaitListItemSearchDto) => Promise<void>;
  initialValues: IWaitListItemSearchDto;
}

export const WaitListSearchForm: FC<IWaitListSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const { account } = initialValues;
  const fixedValues = { account };

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
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
