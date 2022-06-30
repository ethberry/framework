import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { AirdropStatus, IAirdropSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IAirdropSearchFormProps {
  onSubmit: (values: IAirdropSearchDto) => Promise<void>;
  initialValues: IAirdropSearchDto;
  open: boolean;
}

export const AirdropSearchForm: FC<IAirdropSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { airdropStatus, account } = initialValues;
  const fixedValues = { airdropStatus, account };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="AirdropSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="account" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="airdropStatus" options={AirdropStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
