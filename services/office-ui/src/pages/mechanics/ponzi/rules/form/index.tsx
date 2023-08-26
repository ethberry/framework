import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import type { IPonziRuleSearchDto } from "@framework/types";
import { PonziRuleStatus, TokenType } from "@framework/types";

interface IPonziRuleSearchFormProps {
  onSubmit: (values: IPonziRuleSearchDto) => Promise<void>;
  initialValues: IPonziRuleSearchDto;
  open: boolean;
}

export const PonziRuleSearchForm: FC<IPonziRuleSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, ponziRuleStatus, deposit, reward } = initialValues;
  const fixedValues = { query, ponziRuleStatus, deposit, reward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      sx={{ my: 3 }}
      testId="PonziRuleSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="ponziRuleStatus" options={PonziRuleStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="deposit.tokenType" options={TokenType} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="reward.tokenType" options={TokenType} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
