import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { ExchangeStatus, IExchangeSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface IExchangeSearchFormProps {
  onSubmit: (values: IExchangeSearchDto) => Promise<void>;
  initialValues: IExchangeSearchDto;
  open: boolean;
}

export const ExchangeSearchForm: FC<IExchangeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, exchangeStatus } = initialValues;
  const fixedValues = { query, exchangeStatus };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="ExchangeSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="exchangeStatus" options={ExchangeStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
