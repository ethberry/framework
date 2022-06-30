import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IErc1155TemplateSearchDto, TokenType, TemplateStatus } from "@framework/types";

import { useStyles } from "./styles";

interface ITokenSearchFormProps {
  onSubmit: (values: IErc1155TemplateSearchDto) => Promise<void>;
  initialValues: IErc1155TemplateSearchDto;
  open: boolean;
}

export const Erc1155TemplateSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, contractIds, templateStatus } = initialValues;
  const fixedValues = { query, contractIds, templateStatus };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc1155TemplateSearchForm"
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
              controller="uni-contracts"
              multiple
              data={{ contractType: [TokenType.ERC1155] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="templateStatus" options={TemplateStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
