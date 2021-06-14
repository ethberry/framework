import React, {FC} from "react";
import {Collapse, Grid} from "@material-ui/core";

import {AutoSave, FormikForm} from "@trejgun/material-ui-form";
import {MerchantStatus} from "@trejgun/solo-types";
import {SelectInput, SearchInput} from "@trejgun/material-ui-inputs-core";

import useStyles from "./styles";

interface IMerchantSearchFormProps {
  onSubmit: (values: any) => void;
  initialValues: any;
  open: boolean;
}

export const MerchantSearchForm: FC<IMerchantSearchFormProps> = props => {
  const {onSubmit, initialValues, open} = props;

  const classes = useStyles();

  const {query, merchantStatus} = initialValues;
  const fixedValues = {query, merchantStatus};

  return (
    <div className={classes.root}>
      <FormikForm initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
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
        <AutoSave />
      </FormikForm>
    </div>
  );
};
