import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@ethberry/mui-form";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import type { IPredictionAnswerSearchDto } from "@framework/types";

interface IPredictionAnswerFormProps {
  onSubmit: (values: IPredictionAnswerSearchDto) => Promise<void>;
  initialValues: IPredictionAnswerSearchDto;
  open: boolean;
}

export const PredictionAnswerSearchForm: FC<IPredictionAnswerFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { questionIds } = initialValues;
  const fixedValues = { questionIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="PredictionAnswerSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput multiple name="questionIds" controller="prediction/questions" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
