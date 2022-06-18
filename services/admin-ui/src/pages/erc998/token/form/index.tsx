import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { Erc998TokenStatus, IErc998TokenSearchDto, TokenRarity } from "@framework/types";
import { SearchInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ITokenSearchFormProps {
  onSubmit: (values: IErc998TokenSearchDto) => Promise<void>;
  initialValues: IErc998TokenSearchDto;
  open: boolean;
}

export const Erc998TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, tokenStatus, erc998CollectionIds, rarity, tokenId } = initialValues;
  const fixedValues = { query, tokenStatus, erc998CollectionIds, rarity, tokenId };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc998TokenSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EntityInput name="erc998CollectionIds" controller="erc998-collections" multiple />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="tokenId" />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="tokenStatus" options={Erc998TokenStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="rarity" options={TokenRarity} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
