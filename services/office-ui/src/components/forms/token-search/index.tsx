import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import type { ITokenSearchDto } from "@framework/types";
import { ModuleType, TokenStatus, TokenType } from "@framework/types";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { TemplateInput } from "../../inputs/template";

interface ITokenSearchFormProps {
  onSubmit: (values: ITokenSearchDto) => Promise<void>;
  initialValues: ITokenSearchDto;
  open: boolean;
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
}

export const TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType, contractModule } = props;

  const {
    query = "",
    tokenStatus = [TokenStatus.MINTED],
    contractIds = [],
    templateIds = [],
    tokenId = "",
    merchantId,
  } = initialValues;
  const fixedValues = {
    query,
    tokenStatus,
    contractIds,
    templateIds,
    tokenId,
    merchantId,
  };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="TokenSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityInput name="contractIds" controller="contracts" multiple data={{ contractType, contractModule }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TemplateInput />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput name="tokenId" />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput name="tokenStatus" options={TokenStatus} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
