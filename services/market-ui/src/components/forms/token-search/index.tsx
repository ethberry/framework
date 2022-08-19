import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ITokenSearchDto, ModuleType, TokenAttributes, TokenRarity, TokenType } from "@framework/types";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ITokenSearchFormProps {
  onSubmit: (values: ITokenSearchDto) => Promise<void>;
  initialValues: ITokenSearchDto;
  open: boolean;
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
}

export const TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType, contractModule } = props;

  const classes = useStyles();

  const { contractIds, attributes } = initialValues;
  const fixedValues = { contractIds, attributes };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="TokenSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput name="contractIds" controller="contracts" multiple data={{ contractType, contractModule }} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name={`attributes.${TokenAttributes.RARITY}`} options={TokenRarity} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
