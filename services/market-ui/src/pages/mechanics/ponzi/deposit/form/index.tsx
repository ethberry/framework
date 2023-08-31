import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import type { IPonziDepositSearchDto } from "@framework/types";
import { PonziDepositStatus, TokenType } from "@framework/types";

interface IPonziDepositSearchFormProps {
  onSubmit: (values: IPonziDepositSearchDto) => Promise<void>;
  initialValues: IPonziDepositSearchDto;
  open: boolean;
}

export const PonziDepositSearchForm: FC<IPonziDepositSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { formatMessage } = useIntl();

  const { ponziDepositStatus, deposit, reward } = initialValues;
  const fixedValues = { ponziDepositStatus, deposit, reward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="PonziDepositSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput name="ponziDepositStatus" options={PonziDepositStatus} multiple />
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
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
