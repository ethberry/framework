import { FC } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { IWhitelistSearchDto } from "@framework/types";

interface IWhitelistSearchFormProps {
  onSubmit: (values: IWhitelistSearchDto) => Promise<void>;
  initialValues: IWhitelistSearchDto;
}

export const WhitelistSearchForm: FC<IWhitelistSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const { account } = initialValues;
  const fixedValues = { account };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="WhitelistSearchForm"
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
