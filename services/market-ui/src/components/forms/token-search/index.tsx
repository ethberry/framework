import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { IErc721AssetSearchDto, TokenRarity, TokenType } from "@framework/types";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ITokenSearchFormProps {
  onSubmit: (values: IErc721AssetSearchDto) => Promise<void>;
  initialValues: IErc721AssetSearchDto;
  open: boolean;
  contractType: Array<TokenType>;
}

export const TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType } = props;

  const classes = useStyles();

  const { contractIds, rarity } = initialValues;
  const fixedValues = { contractIds, rarity };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="TokenSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput name="contractIds" controller="contracts" multiple data={{ contractType }} />
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
