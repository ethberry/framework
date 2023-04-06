import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { SwitchInput } from "@gemunion/mui-inputs-core";
import type { IPyramidChartSearchDto } from "@framework/types";

import { SearchContractInput } from "../../../../../components/inputs/search-contract";
import { SearchTokenSelectInput } from "../../../../../components/inputs/search-token-select";

interface IPyramidReportSearchFormProps {
  onSubmit: (values: IPyramidChartSearchDto) => Promise<void>;
  initialValues: IPyramidChartSearchDto;
  open: boolean;
}

export const PyramidChartSearchForm: FC<IPyramidReportSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { deposit, reward, emptyReward, startTimestamp, endTimestamp } = initialValues;
  const fixedValues = { deposit, reward, emptyReward, startTimestamp, endTimestamp };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="PyramidChartSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
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
