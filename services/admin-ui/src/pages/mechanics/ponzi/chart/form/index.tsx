import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { SwitchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IPonziChartSearchDto } from "@framework/types";
import { ModuleType } from "@framework/types";

import { SearchContractInput } from "../../../../../components/inputs/search-contract";
import { SearchTokenSelectInput } from "../../../../../components/inputs/search-token-select";

interface IPonziReportSearchFormProps {
  recentDeposits: boolean;
  handleSwitchDeposit: () => void;
  onSubmit: (values: IPonziChartSearchDto) => Promise<void>;
  initialValues: IPonziChartSearchDto;
  open: boolean;
}

export const PonziChartSearchForm: FC<IPonziReportSearchFormProps> = props => {
  const { recentDeposits, handleSwitchDeposit, onSubmit, initialValues, open } = props;

  const { contractId, deposit, reward, emptyReward, startTimestamp, endTimestamp } = initialValues;
  const fixedValues = { contractId, deposit, reward, emptyReward, startTimestamp, endTimestamp };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="PonziChartSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput
              name="contractId"
              controller="contracts"
              data={{ contractModule: [ModuleType.STAKING] }}
              autoselect
              disableClear
            />
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
