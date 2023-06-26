import { FC } from "react";
import { Box, Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ProductStatus } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { IProductSearchDto } from "../index";

interface IProductSearchFormProps {
  onSubmit: (values: IProductSearchDto) => Promise<void>;
  initialValues: IProductSearchDto;
  open: boolean;
}

export const ProductSearchForm: FC<IProductSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, productStatus, categoryIds } = initialValues;
  const fixedValues = { query, productStatus, categoryIds };

  return (
    <Box sx={{ my: 3 }}>
      <FormWrapper initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchInput name="query" />
          </Grid>
        </Grid>
        <Collapse in={open}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SelectInput multiple name="productStatus" options={ProductStatus} />
            </Grid>
            <Grid item xs={12} md={6}>
              <EntityInput multiple name="categoryIds" controller="ecommerce/categories" />
            </Grid>
          </Grid>
        </Collapse>
        <AutoSave onSubmit={onSubmit} />
      </FormWrapper>
    </Box>
  );
};
