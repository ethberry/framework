import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import type { IPyramidRuleSearchDto } from "@framework/types";
import { PyramidRuleStatus, TokenType } from "@framework/types";

interface IPyramidRuleSearchFormProps {
  onSubmit: (values: IPyramidRuleSearchDto) => Promise<void>;
  initialValues: IPyramidRuleSearchDto;
  open: boolean;
}

export const PyramidRuleSearchForm: FC<IPyramidRuleSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, pyramidRuleStatus, deposit, reward } = initialValues;
  const fixedValues = { query, pyramidRuleStatus, deposit, reward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="PyramidRuleSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="pyramidRuleStatus" options={PyramidRuleStatus} />
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
