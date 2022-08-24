import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { ContractStatus, IContractSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface IContractSearchFormProps {
  onSubmit: (values: IContractSearchDto) => Promise<void>;
  initialValues: IContractSearchDto;
  open: boolean;
  contractFeaturesOptions: Record<string, string>;
}

export const ContractSearchForm: FC<IContractSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractFeaturesOptions } = props;

  const classes = useStyles();

  const { query, contractStatus, contractFeatures } = initialValues;
  const fixedValues = { query, contractStatus, contractFeatures };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="ContractSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectInput name="contractStatus" options={ContractStatus} multiple />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="contractFeatures" options={contractFeaturesOptions} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
