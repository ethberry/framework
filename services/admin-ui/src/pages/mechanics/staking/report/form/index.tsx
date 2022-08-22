import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { IStakingStakesSearchDto, StakeStatus, TokenType } from "@framework/types";
import { SearchInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

import { useStyles } from "./styles";

interface IStakingReportSearchFormProps {
  onSubmit: (values: IStakingStakesSearchDto) => Promise<void>;
  initialValues: IStakingStakesSearchDto;
  open: boolean;
}

export const StakingReportSearchForm: FC<IStakingReportSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();
  const { formatMessage } = useIntl();

  const { query, stakeStatus, account, deposit, reward, startTimestamp, endTimestamp } = initialValues;
  const fixedValues = { query, stakeStatus, account, deposit, reward, startTimestamp, endTimestamp };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="ReferralReportSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput name="stakeStatus" options={StakeStatus} multiple />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="account" />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="deposit.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.deposit" })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="reward.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.reward" })}
            />
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
