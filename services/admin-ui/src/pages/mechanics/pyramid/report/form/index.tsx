import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import type { IPyramidReportSearchDto } from "@framework/types";
import { PyramidDepositStatus } from "@framework/types";
import { SearchInput, SelectInput, SwitchInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

import { SearchContractInput } from "../../../../../components/inputs/search-contract";
import { SearchTokenSelectInput } from "../../../../../components/inputs/search-token-select";

interface IPyramidReportSearchFormProps {
  onSubmit: (values: IPyramidReportSearchDto) => Promise<void>;
  initialValues: IPyramidReportSearchDto;
  open: boolean;
}

export const PyramidReportSearchForm: FC<IPyramidReportSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, pyramidDepositStatus, account, emptyReward, deposit, reward, startTimestamp, endTimestamp } =
    initialValues;
  const fixedValues = {
    query,
    pyramidDepositStatus,
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
      testId="PyramidReportSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput name="pyramidDepositStatus" options={PyramidDepositStatus} multiple />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="account" />
          </Grid>
          <Grid item xs={6} />
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
