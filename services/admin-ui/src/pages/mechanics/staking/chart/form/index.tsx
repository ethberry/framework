import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IStakingStakesSearchDto } from "@framework/types";
import { ContractStatus, TokenType } from "@framework/types";

import { useStyles } from "./styles";

interface IStakingReportSearchFormProps {
  onSubmit: (values: IStakingStakesSearchDto) => Promise<void>;
  initialValues: IStakingStakesSearchDto;
  open: boolean;
}

export const StakingChartSearchForm: FC<IStakingReportSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();
  const { formatMessage } = useIntl();

  const { deposit, reward, startTimestamp, endTimestamp } = initialValues;
  const fixedValues = { deposit, reward, startTimestamp, endTimestamp };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="StakingChartForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
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
            <EntityInput
              multiple
              name="deposit.contractIds"
              controller="contracts"
              data={{
                contractType: deposit.tokenType,
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <EntityInput
              multiple
              name="reward.contractIds"
              controller="contracts"
              data={{
                contractType: reward.tokenType,
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
              }}
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
