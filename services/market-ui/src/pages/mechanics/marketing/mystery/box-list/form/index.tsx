import { FC } from "react";
import { Grid } from "@mui/material";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ModuleType, TokenType } from "@framework/types";
import type { IMysteryBoxSearchDto } from "@framework/types";

interface IMysteryboxSearchFormProps {
  onSubmit: (values: IMysteryBoxSearchDto) => Promise<void>;
  initialValues: IMysteryBoxSearchDto;
  open: boolean;
  embedded?: boolean;
}

export const MysteryBoxSearchForm: FC<IMysteryboxSearchFormProps> = props => {
  const { onSubmit, initialValues, open, embedded } = props;

  const { query, contractIds, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, minPrice, maxPrice, contractIds };

  return (
    <CommonSearchForm initialValues={fixedValues} onSubmit={onSubmit} open={open} testId="MysteryboxSearchForm">
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={6}>
          <EthInput name="minPrice" />
        </Grid>
        <Grid item xs={6}>
          <EthInput name="maxPrice" />
        </Grid>
        {!embedded ? (
          <Grid item xs={12}>
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
        ) : null}
      </Grid>
    </CommonSearchForm>
  );
};
