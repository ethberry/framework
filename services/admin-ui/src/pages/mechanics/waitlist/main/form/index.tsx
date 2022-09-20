import { FC } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { IWaitlistSearchDto } from "@framework/types";

interface IWaitlistSearchFormProps {
  onSubmit: (values: IWaitlistSearchDto) => Promise<void>;
  initialValues: IWaitlistSearchDto;
}

export const WaitlistSearchForm: FC<IWaitlistSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const { account } = initialValues;
  const fixedValues = { account };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="WaitlistSearchForm"
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
