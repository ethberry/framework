import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { CraftStatus, ICraftSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface IExchangeSearchFormProps {
  onSubmit: (values: ICraftSearchDto) => Promise<void>;
  initialValues: ICraftSearchDto;
  open: boolean;
}

export const ExchangeSearchForm: FC<IExchangeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, craftStatus } = initialValues;
  const fixedValues = { query, craftStatus };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="ExchangeSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="craftStatus" options={CraftStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
