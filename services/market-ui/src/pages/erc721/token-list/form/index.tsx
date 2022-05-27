import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormikForm } from "@gemunion/mui-form";
import { IErc721AssetSearchDto, TokenRarity } from "@framework/types";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface IErc721TokenSearchFormProps {
  onSearch: (values: IErc721AssetSearchDto) => void;
  initialValues: IErc721AssetSearchDto;
  open: boolean;
  embedded?: boolean;
}

export const Erc721TokenSearchForm: FC<IErc721TokenSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { erc721CollectionIds, rarity } = initialValues;
  const fixedValues = { erc721CollectionIds, rarity };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721TokenSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EntityInput name="erc721CollectionIds" controller="erc721-collections" onSearch={onSearch} multiple />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="rarity" options={TokenRarity} onSearch={onSearch} multiple />
          </Grid>
        </Grid>
      </Collapse>
    </FormikForm>
  );
};
