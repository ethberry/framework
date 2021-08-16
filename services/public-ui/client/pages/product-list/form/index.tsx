import React, { FC } from "react";
import { Collapse, Grid } from "@material-ui/core";

import { AutoSave, FormikForm } from "@gemunion/material-ui-form";
import { EntityInput } from "@gemunion/material-ui-inputs-entity";
import { SearchInput } from "@gemunion/material-ui-inputs-core";

import useStyles from "./styles";
import { IProductSearchDto } from "../index";

interface IProductSearchFormProps {
  onSubmit: (values: any) => void;
  initialValues: IProductSearchDto;
  open: boolean;
  hideMerchantsInSearch: boolean;
}

export const ProductSearchForm: FC<IProductSearchFormProps> = props => {
  const { onSubmit, initialValues, open, hideMerchantsInSearch } = props;

  const classes = useStyles();

  const { query, categoryIds, merchantId } = initialValues;
  const fixedValues = { query, categoryIds, merchantId };

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
            <Grid item xs={hideMerchantsInSearch ? 12 : 6}>
              <EntityInput multiple name="categoryIds" controller="categories" />
            </Grid>
            {hideMerchantsInSearch ? null : (
              <Grid item xs={6}>
                <EntityInput name="merchantId" controller="merchants" />
              </Grid>
            )}
          </Grid>
        </Collapse>
        <AutoSave />
      </FormikForm>
    </div>
  );
};
