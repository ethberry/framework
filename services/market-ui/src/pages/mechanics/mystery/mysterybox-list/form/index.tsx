import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { IMysteryBoxSearchDto } from "@framework/types";
import { EthInput } from "@gemunion/mui-inputs-mask";

interface IMysteryboxSearchFormProps {
  onSubmit: (values: IMysteryBoxSearchDto) => Promise<void>;

  initialValues: IMysteryBoxSearchDto;
  open: boolean;
  embedded?: boolean;
}

export const MysteryboxSearchForm: FC<IMysteryboxSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, minPrice, maxPrice };

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
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
