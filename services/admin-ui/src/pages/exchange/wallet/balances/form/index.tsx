import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IBalanceSearchDto, TokenType } from "@framework/types";

import { TemplateInput } from "./template-input";

interface IBalanceSearchFormProps {
  onSubmit: (values: IBalanceSearchDto) => Promise<void>;
  initialValues: IBalanceSearchDto;
  open: boolean;
}

export const BalanceSearchForm: FC<IBalanceSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { minBalance, maxBalance, contractIds, templateIds } = initialValues;
  const fixedValues = { minBalance, maxBalance, contractIds, templateIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="SystemBalanceSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              multiple
              name="contractIds"
              controller="contracts"
              data={{
                contractType: [TokenType.ERC20, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TemplateInput />
          </Grid>
          <Grid item xs={6}>
            <EthInput name="minBalance" />
          </Grid>
          <Grid item xs={6}>
            <EthInput name="maxBalance" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
