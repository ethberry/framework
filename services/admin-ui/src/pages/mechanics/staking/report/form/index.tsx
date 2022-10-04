import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ContractStatus, ModuleType, StakingDepositStatus, TokenType } from "@framework/types";
import { SearchInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import type { IStakingReportSearchDto } from "@framework/types";

interface IStakingReportSearchFormProps {
  onSubmit: (values: IStakingReportSearchDto) => Promise<void>;
  initialValues: IStakingReportSearchDto;
  open: boolean;
}

export const StakingReportSearchForm: FC<IStakingReportSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { formatMessage } = useIntl();

  const { query, stakingDepositStatus, account, deposit, reward, startTimestamp, endTimestamp } = initialValues;
  const fixedValues = { query, stakingDepositStatus, account, deposit, reward, startTimestamp, endTimestamp };

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
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput name="stakingDepositStatus" options={StakingDepositStatus} multiple />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="account" />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              name="deposit.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.deposit" })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              name="reward.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.reward" })}
            />
          </Grid>
          <Grid item xs={6}>
            <EntityInput
              name="deposit.contractId"
              controller="contracts"
              data={{
                contractType: [deposit.tokenType],
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
                contractModule: [ModuleType.HIERARCHY],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <EntityInput
              name="reward.contractId"
              controller="contracts"
              data={{
                contractType: [reward.tokenType],
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
                contractModule: [ModuleType.HIERARCHY],
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
