import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import type { IStakingRuleSearchDto } from "@framework/types";
import { StakingStatus, TokenType } from "@framework/types";

import { useStyles } from "./styles";

interface IStakingRuleSearchFormProps {
  onSubmit: (values: IStakingRuleSearchDto) => Promise<void>;
  initialValues: IStakingRuleSearchDto;
  open: boolean;
}

export const StakingRuleSearchForm: FC<IStakingRuleSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, stakingStatus, deposit, reward } = initialValues;
  const fixedValues = { query, stakingStatus, deposit, reward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="StakingRuleSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="stakingStatus" options={StakingStatus} />
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
