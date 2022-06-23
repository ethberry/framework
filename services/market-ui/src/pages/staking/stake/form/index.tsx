import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { IStakingRuleSearchDto, StakingRuleStatus, TokenType } from "@framework/types";

import { useStyles } from "./styles";

interface IRecipeSearchFormProps {
  onSubmit: (values: IStakingRuleSearchDto) => Promise<void>;
  initialValues: IStakingRuleSearchDto;
  open: boolean;
}

export const StakingSearchForm: FC<IRecipeSearchFormProps> = props => {
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
      data-testid="StakingSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="stakingStatus" options={StakingRuleStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="deposit.tokenType" options={TokenType} disabledOptions={[TokenType.ERC998]} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="reward.tokenType" options={TokenType} disabledOptions={[TokenType.ERC998]} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
