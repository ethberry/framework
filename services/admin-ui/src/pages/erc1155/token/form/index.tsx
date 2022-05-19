import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormikForm } from "@gemunion/mui-form";
import { IErc1155TokenSearchDto } from "@framework/types";
import { SearchInput, TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ITokenSearchFormProps {
  onSubmit: (values: IErc1155TokenSearchDto) => void;
  initialValues: IErc1155TokenSearchDto;
  open: boolean;
}

export const Erc1155TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, erc1155CollectionIds, tokenId } = initialValues;
  const fixedValues = { query, erc1155CollectionIds, tokenId };

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
            <EntityInput name="erc1155CollectionIds" controller="erc1155-collections" multiple />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="tokenId" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave />
    </FormikForm>
  );
};
