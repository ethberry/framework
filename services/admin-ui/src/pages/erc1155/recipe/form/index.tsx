import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormikForm } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { Erc1155RecipeStatus, IErc1155RecipeSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface IRecipeSearchFormProps {
  onSubmit: (values: IErc1155RecipeSearchDto) => void;
  initialValues: IErc1155RecipeSearchDto;
  open: boolean;
}

export const Erc1155RecipeSearchForm: FC<IRecipeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, recipeStatus } = initialValues;
  const fixedValues = { query, recipeStatus };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc1155RecipeSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="recipeStatus" options={Erc1155RecipeStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave />
    </FormikForm>
  );
};
