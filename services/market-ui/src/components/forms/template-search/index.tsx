import { FC } from "react";
import { Grid } from "@mui/material";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { ITemplateSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { FormRefresher } from "../form-refresher";

interface ITemplateSearchFormProps {
  onSubmit: (values: ITemplateSearchDto) => Promise<void>;
  initialValues: ITemplateSearchDto;
  open: boolean;
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
  onRefreshPage: () => Promise<void>;
  embedded?: boolean;
}

export const TemplateSearchForm: FC<ITemplateSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType, contractModule, onRefreshPage, embedded } = props;

  const { query, contractIds, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, contractIds, minPrice, maxPrice };

  return (
    <CommonSearchForm initialValues={fixedValues} onSubmit={onSubmit} open={open} testId="TemplateSearchForm">
      <FormRefresher onRefreshPage={onRefreshPage} />
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={6}>
          <EthInput name="minPrice" />
        </Grid>
        <Grid item xs={6}>
          <EthInput name="maxPrice" />
        </Grid>
        {!embedded ? (
          <Grid item xs={12}>
            <EntityInput name="contractIds" controller="contracts" multiple data={{ contractType, contractModule }} />
          </Grid>
        ) : null}
      </Grid>
    </CommonSearchForm>
  );
};
