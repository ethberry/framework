import { FC } from "react";
import { Box, Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SearchInput } from "@gemunion/mui-inputs-core";

import { IProductSearchDto } from "../index";

interface IProductSearchFormProps {
  onSubmit: (values: any) => Promise<void>;
  initialValues: IProductSearchDto;
  open: boolean;
}

export const ProductSearchForm: FC<IProductSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, categoryIds } = initialValues;
  const fixedValues = { query, categoryIds };

  return (
    <Box sx={{ my: 2 }}>
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
            {/* <Grid item xs={6}> */}
            {/*  <EntityInput name="merchantId" controller="merchants" /> */}
            {/* </Grid> */}
          </Grid>
        </Collapse>
        <AutoSave onSubmit={onSubmit} />
      </FormWrapper>
    </Box>
  );
};
