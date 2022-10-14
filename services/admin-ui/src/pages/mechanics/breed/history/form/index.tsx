import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IBreedHistorySearchDto } from "@framework/types";

interface IBreedHistorySearchFormProps {
  onSubmit: (values: IBreedHistorySearchDto) => Promise<void>;
  initialValues: IBreedHistorySearchDto;
  open: boolean;
}

export const BreedHistorySearchForm: FC<IBreedHistorySearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { childIds } = initialValues;
  const fixedValues = { childIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="BreedHistorySearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput multiple name="childIds" controller="breed/history" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
