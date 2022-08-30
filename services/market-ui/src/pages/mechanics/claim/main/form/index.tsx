import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import type { IClaimSearchDto } from "@framework/types";
import { ClaimStatus } from "@framework/types";

import { useStyles } from "./styles";

interface IClaimSearchFormProps {
  onSubmit: (values: IClaimSearchDto) => Promise<void>;
  initialValues: IClaimSearchDto;
  open: boolean;
}

export const ClaimSearchForm: FC<IClaimSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { account, claimStatus } = initialValues;
  const fixedValues = { account, claimStatus };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="StakingRuleSearchForm"
    >
      <Collapse in={open}>
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="claimStatus" options={ClaimStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
