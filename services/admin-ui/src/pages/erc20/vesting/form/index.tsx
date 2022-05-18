import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormikForm } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { Erc20VestingTemplate, IErc20VestingSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface IVestingSearchFormProps {
  onSubmit: (values: IErc20VestingSearchDto) => void;
  initialValues: IErc20VestingSearchDto;
  open: boolean;
}

export const Erc20VestingSearchForm: FC<IVestingSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, vestingTemplate } = initialValues;
  const fixedValues = { query, vestingTemplate };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc20VestingSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectInput name="vestingTemplate" options={Erc20VestingTemplate} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave />
    </FormikForm>
  );
};
