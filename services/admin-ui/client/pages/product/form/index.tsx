import React, {FC} from "react";
import {Collapse, Grid} from "@material-ui/core";

import {AutoSave, FormikForm} from "@trejgun/material-ui-form";
import {ProductStatus} from "@trejgun/solo-types";
import {SelectInput, SearchInput} from "@trejgun/material-ui-inputs-core";

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

  const {query, productStatus} = initialValues;
  const fixedValues = {query, productStatus};

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
              <SelectInput multiple name="productStatus" options={ProductStatus} />
            </Grid>
          </Grid>
        </Collapse>
        <AutoSave />
      </FormikForm>
    </div>
  );
};
