import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { ILotteryTokenSearchDto } from "@framework/types";

interface ILotteryTokenSearchFormProps {
  onSubmit: (values: ILotteryTokenSearchDto) => Promise<void>;
  initialValues: ILotteryTokenSearchDto;
  open: boolean;
}

export const LotteryTokenSearchForm: FC<ILotteryTokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { roundIds } = initialValues;
  const fixedValues = { roundIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="LotteryTokenSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput multiple name="roundIds" controller="lottery/rounds" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};