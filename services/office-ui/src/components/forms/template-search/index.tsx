import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { ITemplateSearchDto } from "@framework/types";
import { TemplateStatus, TokenType } from "@framework/types";

interface ITemplateSearchFormProps {
  onSubmit: (values: ITemplateSearchDto) => Promise<void>;
  initialValues: ITemplateSearchDto;
  open: boolean;
  contractType: Array<TokenType>;
}

export const TemplateSearchForm: FC<ITemplateSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType } = props;

  const { query, templateStatus, contractIds, merchantId } = initialValues;
  const fixedValues = { query, templateStatus, contractIds, merchantId };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="TemplateSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityInput name="contractIds" controller="contracts" multiple data={{ contractType }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput multiple name="templateStatus" options={TemplateStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
