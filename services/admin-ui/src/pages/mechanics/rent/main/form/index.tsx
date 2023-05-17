import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { ContractFeatures, IRentSearchDto, RentRuleStatus } from "@framework/types";

interface IRentSearchFormProps {
  onSubmit: (values: IRentSearchDto) => Promise<void>;
  initialValues: IRentSearchDto;
  open: boolean;
}

export const RentSearchForm: FC<IRentSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, rentStatus, contractIds } = initialValues;
  const fixedValues = { query, rentStatus, contractIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="RentSearchForm"
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
              data={{ contractFeatures: [ContractFeatures.RENTABLE] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="rentStatus" options={RentRuleStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
