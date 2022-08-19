import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ITokenSearchDto, TokenAttributes, TokenRarity, TokenType } from "@framework/types";
import { SearchInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";
import { TemplateInput } from "./template-input";

interface IErc721TokenSearchFormProps {
  onSubmit: (values: ITokenSearchDto) => Promise<void>;
  initialValues: ITokenSearchDto;
  open: boolean;
}

export const Erc721TokenSearchForm: FC<IErc721TokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, tokenStatus, contractIds, templateIds, attributes, tokenId } = initialValues;
  const fixedValues = { query, tokenStatus, contractIds, templateIds, attributes, tokenId };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="Erc721TokenSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractType: [TokenType.ERC721] }}
            />
          </Grid>
          <Grid item xs={6}>
            <TemplateInput />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="tokenId" />
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
