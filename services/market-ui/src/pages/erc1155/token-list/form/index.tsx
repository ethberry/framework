import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormikForm } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { IErc1155TokenSearchDto } from "@framework/types";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { useStyles } from "./styles";

interface IErc1155TokenSearchFormProps {
  onSubmit: (values: any) => void;
  initialValues: IErc1155TokenSearchDto;
  open: boolean;
  embedded?: boolean;
}

export const Erc1155TokenSearchForm: FC<IErc1155TokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open, embedded } = props;

  const classes = useStyles();

  const { query, erc1155CollectionIds, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, erc1155CollectionIds, minPrice, maxPrice };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc1155TokenSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EthInput name="minPrice" />
          </Grid>
          <Grid item xs={6}>
            <EthInput name="maxPrice" />
          </Grid>
          {!embedded ? (
            <Grid item xs={6}>
              <EntityInput name="erc1155CollectionIds" controller="erc1155-collections" multiple />
            </Grid>
          ) : null}
        </Grid>
      </Collapse>
      <AutoSave />
    </FormikForm>
  );
};
