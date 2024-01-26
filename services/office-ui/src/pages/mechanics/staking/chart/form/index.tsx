import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { SwitchInput } from "@gemunion/mui-inputs-core";
import type { IStakingChartSearchDto } from "@framework/types";

import { SearchContractInput } from "../../../../../components/inputs/search-contract";
import { SearchTokenSelectInput } from "../../../../../components/inputs/search-token-select";
import { StakingContractInput } from "../../../../../components/inputs/staking-contract";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";

interface IStakingReportSearchFormProps {
  recentDeposits: boolean;
  handleSwitchDeposit: () => void;
  onSubmit: (values: IStakingChartSearchDto) => Promise<void>;
  initialValues: IStakingChartSearchDto;
  open: boolean;
}

export const StakingChartSearchForm: FC<IStakingReportSearchFormProps> = props => {
  const { recentDeposits, handleSwitchDeposit, onSubmit, initialValues, open } = props;

  const { deposit, reward, emptyReward, merchantId, startTimestamp, endTimestamp } = initialValues;
  const fixedValues = { deposit, reward, emptyReward, merchantId, startTimestamp, endTimestamp };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="StakingChartSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={6}>
            <StakingContractInput />
          </Grid>
          <Grid item xs={6}>
            <SwitchInput name={recentDeposits ? "recentDeposits" : "allDeposits"} onChange={handleSwitchDeposit} />
          </Grid>
          <Grid item xs={6}>
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
