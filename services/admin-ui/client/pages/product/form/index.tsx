import React, {FC} from "react";
import {Collapse, Grid} from "@material-ui/core";

import {AutoSave, FormikForm} from "@gemunionstudio/material-ui-form";
import {ProductStatus} from "@gemunionstudio/solo-types";
import {SelectInput, SearchInput} from "@gemunionstudio/material-ui-inputs-core";
import {EntityInput} from "@gemunionstudio/material-ui-inputs-entity";

import useStyles from "./styles";
import {IProductSearchDto} from "../index";

interface IProductSearchFormProps {
  onSubmit: (values: IProductSearchDto) => void;
  initialValues: IProductSearchDto;
  open: boolean;
}

export const ProductSearchForm: FC<IProductSearchFormProps> = props => {
  const {onSubmit, initialValues, open} = props;

  const classes = useStyles();

  const {query, productStatus, categoryIds} = initialValues;
  const fixedValues = {query, productStatus, categoryIds};

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
            <Grid item xs={6}>
              <SelectInput multiple name="productStatus" options={ProductStatus} />
            </Grid>
            <Grid item xs={6}>
              <EntityInput multiple name="categoryIds" controller="categories" />
            </Grid>
          </Grid>
        </Collapse>
        <AutoSave />
      </FormikForm>
    </div>
  );
};
