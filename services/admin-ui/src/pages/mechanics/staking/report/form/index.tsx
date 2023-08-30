import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput, SwitchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import type { IStakingReportSearchDto } from "@framework/types";
import { ModuleType, StakingDepositStatus } from "@framework/types";

import { SearchContractInput } from "../../../../../components/inputs/search-contract";
import { SearchTokenSelectInput } from "../../../../../components/inputs/search-token-select";

interface IStakingReportSearchFormProps {
  onSubmit: (values: IStakingReportSearchDto) => Promise<void>;
  initialValues: IStakingReportSearchDto;
  open: boolean;
}

export const StakingReportSearchForm: FC<IStakingReportSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { contractId, stakingDepositStatus, account, emptyReward, deposit, reward, startTimestamp, endTimestamp } =
    initialValues;
  const fixedValues = {
    contractId,
    stakingDepositStatus,
    account,
    emptyReward,
    deposit,
    reward,
    startTimestamp,
    endTimestamp,
  };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="StakingReportSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="account" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractId"
              controller="contracts"
              data={{ contractModule: [ModuleType.STAKING] }}
              autoselect
              disableClear
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="stakingDepositStatus" options={StakingDepositStatus} multiple />
          </Grid>
          <Grid item xs={12}>
            <SwitchInput name="emptyReward" />
          </Grid>
          <Grid item xs={6}>
            <SearchTokenSelectInput prefix="deposit" />
          </Grid>
          <Grid item xs={6}>
            <SearchTokenSelectInput prefix="reward" />
          </Grid>
          <Grid item xs={6}>
            <SearchContractInput prefix="deposit" />
          </Grid>
          <Grid item xs={6}>
            <SearchContractInput prefix="reward" />
          </Grid>
          <Grid item xs={6}>
            <DateTimeInput name="startTimestamp" />
          </Grid>
          <Grid item xs={6}>
            <DateTimeInput name="endTimestamp" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
