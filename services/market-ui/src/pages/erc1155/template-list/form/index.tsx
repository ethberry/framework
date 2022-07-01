import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { ITemplateSearchDto, TokenType } from "@framework/types";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { useStyles } from "./styles";

interface IErc1155TokenSearchFormProps {
  onSubmit: (values: ITemplateSearchDto) => Promise<void>;
  initialValues: ITemplateSearchDto;
  open: boolean;
  embedded?: boolean;
}

export const Erc1155TokenSearchForm: FC<IErc1155TokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open, embedded } = props;

  const classes = useStyles();

  const { query, contractIds, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, contractIds, minPrice, maxPrice };

  return (
    <FormWrapper
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
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EthInput name="minPrice" />
          </Grid>
          <Grid item xs={6}>
            <EthInput name="maxPrice" />
          </Grid>
          {!embedded ? (
            <Grid item xs={6}>
              <EntityInput
                name="contractIds"
                controller="contracts"
                multiple
                data={{ contractType: [TokenType.ERC1155] }}
              />
            </Grid>
          ) : null}
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
