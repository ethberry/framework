import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { IBalanceSearchDto } from "@framework/types";

interface IBalanceSearchFormProps {
  onSubmit: (values: IBalanceSearchDto) => Promise<void>;
  initialValues: IBalanceSearchDto;
  open: boolean;
}

export const BalanceSearchForm: FC<IBalanceSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { minBalance, maxBalance } = initialValues;
  const fixedValues = { minBalance, maxBalance };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="SystemBalanceSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EthInput name="minBalance" />
          </Grid>
          <Grid item xs={6}>
            <EthInput name="maxBalance" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
