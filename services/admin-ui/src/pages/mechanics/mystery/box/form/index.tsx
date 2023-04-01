import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IMysteryBoxSearchDto } from "@framework/types";
import { ModuleType, MysteryboxStatus, TokenType } from "@framework/types";

interface IMysteryboxSearchFormProps {
  onSubmit: (values: IMysteryBoxSearchDto) => Promise<void>;
  initialValues: IMysteryBoxSearchDto;
  open: boolean;
}

export const MysteryboxSearchForm: FC<IMysteryboxSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, mysteryboxStatus, contractIds } = initialValues;
  const fixedValues = { query, mysteryboxStatus, contractIds };

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
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{
                contractType: [TokenType.ERC721],
                contractModule: [ModuleType.MYSTERY],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="mysteryboxStatus" options={MysteryboxStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
