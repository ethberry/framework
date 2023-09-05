import { FC } from "react";
import { Grid } from "@mui/material";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { ITemplateSearchDto } from "@framework/types";
import { ModuleType, TemplateStatus, TokenType } from "@framework/types";
import { ContractInput } from "./contract-input";

interface ITemplateSearchFormProps {
  onSubmit: (values: ITemplateSearchDto) => Promise<void>;
  initialValues: ITemplateSearchDto;
  open: boolean;
  contractType?: Array<TokenType>;
  contractModule?: Array<ModuleType>;
}

export const TemplateSearchForm: FC<ITemplateSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType = [], contractModule = [] } = props;

  const { query, templateStatus, contractIds, merchantId } = initialValues;
  const fixedValues = { query, templateStatus, contractIds, merchantId };

  return (
    <CommonSearchForm initialValues={fixedValues} onSubmit={onSubmit} open={open} testId="TemplateSearchForm">
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12}>
          <EntityInput name="merchantId" controller="merchants" />
        </Grid>
        <Grid item xs={6}>
          <ContractInput name="contractIds" multiple data={{ contractType, contractModule }} />
        </Grid>
        <Grid item xs={6}>
          <SelectInput multiple name="templateStatus" options={TemplateStatus} />
        </Grid>
      </Grid>
    </CommonSearchForm>
  );
};
