import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { Erc721RecipeStatus, IErc721RecipeSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface IRecipeSearchFormProps {
  onSubmit: (values: IErc721RecipeSearchDto) => Promise<void>;
  initialValues: IErc721RecipeSearchDto;
  open: boolean;
}

export const Erc721RecipeSearchForm: FC<IRecipeSearchFormProps> = props => {
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
      data-testid="Erc721RecipeSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="recipeStatus" options={Erc721RecipeStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
