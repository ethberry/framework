import { FC } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ILotteryTicketSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface ILotteryTicketSearchFormProps {
  onSubmit: (values: ILotteryTicketSearchDto) => Promise<void>;
  initialValues: ILotteryTicketSearchDto;
  open: boolean;
}

export const LotteryTicketSearchForm: FC<ILotteryTicketSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const classes = useStyles();

  const { roundIds } = initialValues;
  const fixedValues = { roundIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="StakesSearchForm"
    >
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12}>
          {/* select round */}
        </Grid>
      </Grid>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
