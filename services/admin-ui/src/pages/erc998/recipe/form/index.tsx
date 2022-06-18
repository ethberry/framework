import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { Erc998RecipeStatus, IErc998RecipeSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface IRecipeSearchFormProps {
  onSubmit: (values: IErc998RecipeSearchDto) => Promise<void>;
  initialValues: IErc998RecipeSearchDto;
  open: boolean;
}

export const Erc998RecipeSearchForm: FC<IRecipeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, recipeStatus } = initialValues;
  const fixedValues = { query, recipeStatus };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc998RecipeSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="recipeStatus" options={Erc998RecipeStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
