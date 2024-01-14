import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { IReferralReportSearchDto } from "@framework/types";

interface IReferralReportSearchFormProps {
  onSubmit: (values: IReferralReportSearchDto) => Promise<void>;
  initialValues: IReferralReportSearchDto;
  open: boolean;
}

export const ReferralReportSearchForm: FC<IReferralReportSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { startTimestamp, endTimestamp } = initialValues;
  const fixedValues = { startTimestamp, endTimestamp };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="ReferralReportSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <DateTimeInput name="startTimestamp" />
          </Grid>
          <Grid item xs={6}>
            <DateTimeInput name="endTimestamp" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
