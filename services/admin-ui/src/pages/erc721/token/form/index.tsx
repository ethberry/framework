import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormikForm } from "@gemunion/mui-form";
import { Erc721TokenStatus, IErc721TokenSearchDto, TokenRarity } from "@framework/types";
import { SearchInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ITokenSearchFormProps {
  onSearch: (values: IErc721TokenSearchDto) => void;
  initialValues: IErc721TokenSearchDto;
  open: boolean;
}

export const Erc721TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { query, tokenStatus, erc721CollectionIds, rarity, tokenId } = initialValues;
  const fixedValues = { query, tokenStatus, erc721CollectionIds, rarity, tokenId };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721TokenSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" onSearch={onSearch} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EntityInput name="erc721CollectionIds" controller="erc721-collections" onSearch={onSearch} multiple />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="tokenId" onSearch={onSearch} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="tokenStatus" options={Erc721TokenStatus} onSearch={onSearch} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="rarity" options={TokenRarity} onSearch={onSearch} multiple />
          </Grid>
        </Grid>
      </Collapse>
    </FormikForm>
  );
};
