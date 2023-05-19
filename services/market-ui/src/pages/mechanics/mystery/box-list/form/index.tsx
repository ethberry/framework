import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IMysteryBoxSearchDto, ModuleType, TokenType } from "@framework/types";

interface IMysteryboxSearchFormProps {
  onSubmit: (values: IMysteryBoxSearchDto) => Promise<void>;
  initialValues: IMysteryBoxSearchDto;
  open: boolean;
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
  embedded?: boolean;
}

export const MysteryboxSearchForm: FC<IMysteryboxSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType, contractModule, embedded } = props;

  const { query, contractIds, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, minPrice, maxPrice, contractIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="MysteryboxSearchForm"
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
            <Grid item xs={12}>
              <EntityInput name="contractIds" controller="contracts" multiple data={{ contractType, contractModule }} />
            </Grid>
          ) : null}
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
