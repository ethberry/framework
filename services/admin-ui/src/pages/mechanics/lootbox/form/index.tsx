import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { LootboxStatus, ILootboxSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ILootboxSearchFormProps {
  onSubmit: (values: ILootboxSearchDto) => Promise<void>;
  initialValues: ILootboxSearchDto;
  open: boolean;
}

export const Erc721LootboxSearchForm: FC<ILootboxSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, lootboxStatus, contractIds } = initialValues;
  const fixedValues = { query, lootboxStatus, contractIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721LootboxSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput name="contractIds" controller="contracts" multiple data={{}} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="lootboxStatus" options={LootboxStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
