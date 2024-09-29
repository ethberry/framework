import { FC } from "react";
import { Grid } from "@mui/material";

import { CommonSearchForm } from "@ethberry/mui-form-search";
import { EthInput } from "@ethberry/mui-inputs-mask";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ModuleType, TokenType } from "@framework/types";
import type { ILootBoxSearchDto } from "@framework/types";

interface ILootboxSearchFormProps {
  onSubmit: (values: ILootBoxSearchDto) => Promise<void>;
  initialValues: ILootBoxSearchDto;
  open: boolean;
  embedded?: boolean;
}

export const LootBoxSearchForm: FC<ILootboxSearchFormProps> = props => {
  const { onSubmit, initialValues, open, embedded } = props;

  const { query, contractIds, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, minPrice, maxPrice, contractIds };

  return (
    <CommonSearchForm initialValues={fixedValues} onSubmit={onSubmit} open={open} testId="LootboxSearchForm">
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
                contractModule: [ModuleType.LOOT],
              }}
            />
          </Grid>
        ) : null}
      </Grid>
    </CommonSearchForm>
  );
};
