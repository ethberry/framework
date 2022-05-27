import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormikForm } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { IErc721DropboxSearchDto } from "@framework/types";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { useStyles } from "./styles";

interface IErc721DropboxSearchFormProps {
  onSearch: (values: any) => void;
  initialValues: IErc721DropboxSearchDto;
  open: boolean;
  embedded?: boolean;
}

export const Erc721DropboxSearchForm: FC<IErc721DropboxSearchFormProps> = props => {
  const { onSearch, initialValues, open, embedded } = props;

  const classes = useStyles();

  const { query, erc721CollectionIds, erc721TemplateCollectionIds, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, erc721CollectionIds, erc721TemplateCollectionIds, minPrice, maxPrice };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721DropboxSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" onSearch={onSearch} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EthInput name="minPrice" onSearch={onSearch} />
          </Grid>
          <Grid item xs={6}>
            <EthInput name="maxPrice" onSearch={onSearch} />
          </Grid>
          {!embedded ? (
            <Grid item xs={6}>
              <EntityInput name="erc721CollectionIds" controller="erc721-collections" onSearch={onSearch} multiple />
            </Grid>
          ) : null}
        </Grid>
      </Collapse>
    </FormikForm>
  );
};
