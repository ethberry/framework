import { FC, Fragment } from "react";
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

  const { contractIds = [], attributes } = initialValues;
  const fixedValues = {
    contractIds,
    attributes: Object.assign(
      {
        [TokenAttributes.RARITY]: [],
        [TokenAttributes.GRADE]: [],
      },
      attributes,
    ),
  };

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
          <Grid item xs={12}>
            <EntityInput name="contractIds" controller="contracts" multiple data={{ contractType, contractModule }} />
          </Grid>
          {contractType.filter(value => [TokenType.ERC721, TokenType.ERC998].includes(value)).length &&
          contractModule.filter(value => [ModuleType.HIERARCHY].includes(value)).length ? (
            <Fragment>
              <Grid item xs={6}>
                <SelectInput name={`attributes.${TokenAttributes.RARITY}`} options={TokenRarity} multiple />
              </Grid>
              <Grid item xs={6}>
                <SelectInput
                  name={`attributes.${TokenAttributes.GRADE}`}
                  options={new Array(10)
                    .fill(null)
                    .reduce((memo: Record<string, string>, value, i) => Object.assign(memo, { [i + 1]: i + 1 }), {})}
                  multiple
                />
              </Grid>
            </Fragment>
          ) : null}
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
