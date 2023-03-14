import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SearchInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";
import { IProductSearchDto } from "../index";

interface IProductSearchFormProps {
  onSubmit: (values: any) => Promise<void>;
  initialValues: IProductSearchDto;
  open: boolean;
}

export const ProductSearchForm: FC<IProductSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, categoryIds, merchantId } = initialValues;
  const fixedValues = { query, categoryIds, merchantId };

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
            <Grid item xs={6}>
              <EntityInput multiple name="categoryIds" controller="categories" />
            </Grid>
            <Grid item xs={6}>
              <EntityInput name="merchantId" controller="merchants" />
            </Grid>
          </Grid>
        </Collapse>
        <AutoSave onSubmit={onSubmit} />
      </FormWrapper>
    </div>
  );
};
