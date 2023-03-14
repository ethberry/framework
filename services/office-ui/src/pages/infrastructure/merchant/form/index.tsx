import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { IMerchantSearchDto, MerchantStatus } from "@framework/types";

import { useStyles } from "./styles";

interface IMerchantSearchFormProps {
  onSubmit: (values: IMerchantSearchDto) => Promise<void>;
  initialValues: IMerchantSearchDto;
  open: boolean;
}

export const MerchantSearchForm: FC<IMerchantSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, merchantStatus } = initialValues;
  const fixedValues = { query, merchantStatus };

  return (
    <div className={classes.root}>
      <FormWrapper initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchInput name="query" />
          </Grid>
        </Grid>
        <Collapse in={open}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SelectInput multiple name="merchantStatus" options={MerchantStatus} />
            </Grid>
          </Grid>
        </Collapse>
        <AutoSave onSubmit={onSubmit} />
      </FormWrapper>
    </div>
  );
};
