import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IPyramidChartSearchDto } from "@framework/types";
import { ContractStatus, ModuleType, TokenType } from "@framework/types";

interface IPyramidReportSearchFormProps {
  onSubmit: (values: IPyramidChartSearchDto) => Promise<void>;
  initialValues: IPyramidChartSearchDto;
  open: boolean;
}

export const PyramidChartSearchForm: FC<IPyramidReportSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { formatMessage } = useIntl();

  const { deposit, reward, startTimestamp, endTimestamp } = initialValues;
  const fixedValues = { deposit, reward, startTimestamp, endTimestamp };

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
