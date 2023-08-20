import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IStakingRuleSearchDto } from "@framework/types";
import { ModuleType, StakingDepositTokenType, StakingRewardTokenType, StakingRuleStatus } from "@framework/types";

interface IStakingRuleSearchFormProps {
  onSubmit: (values: IStakingRuleSearchDto) => Promise<void>;
  initialValues: IStakingRuleSearchDto;
  open: boolean;
}

export const StakingRuleSearchForm: FC<IStakingRuleSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, merchantId, stakingRuleStatus, contractIds, deposit, reward } = initialValues;
  const fixedValues = { query, merchantId, stakingRuleStatus, contractIds, deposit, reward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
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
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractModule: [ModuleType.STAKING] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="stakingRuleStatus" options={StakingRuleStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="deposit.tokenType" options={StakingDepositTokenType} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="reward.tokenType" options={StakingRewardTokenType} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
