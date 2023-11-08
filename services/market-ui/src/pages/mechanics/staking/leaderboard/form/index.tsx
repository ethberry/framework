import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SwitchInput } from "@gemunion/mui-inputs-core";
import type { IStakingLeaderboardSearchDto } from "@framework/types";

import { SearchContractInput } from "../../../../../components/inputs/search-contract";
import { SearchTokenSelectInput } from "../../../../../components/inputs/search-token-select";

interface IStakingLeaderboardSearchFormProps {
  onSubmit: (values: IStakingLeaderboardSearchDto) => Promise<void>;
  initialValues: IStakingLeaderboardSearchDto;
  open: boolean;
}

export const StakingLeaderboardSearchForm: FC<IStakingLeaderboardSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { deposit, reward, emptyReward } = initialValues;
  const fixedValues = { deposit, reward, emptyReward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="StakingLeaderboardSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}></Grid>
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
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
