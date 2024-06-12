import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IRaffleTicketTokenSearchDto } from "@framework/types";

interface IRaffleTokenSearchFormProps {
  onSubmit: (values: IRaffleTicketTokenSearchDto) => Promise<void>;
  initialValues: IRaffleTicketTokenSearchDto;
  open: boolean;
}

export const RaffleTokenSearchForm: FC<IRaffleTokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { roundIds } = initialValues;
  const fixedValues = { roundIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="RaffleTokenSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput multiple name="roundIds" controller="raffle/rounds" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
