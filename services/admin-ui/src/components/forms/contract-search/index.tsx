import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ContractRole, ContractStatus, IContractSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IContractSearchFormProps {
  onSubmit: (values: IContractSearchDto) => Promise<void>;
  initialValues: IContractSearchDto;
  open: boolean;
  contractTemplateOptions: Record<string, string>;
}

export const ContractSearchForm: FC<IContractSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractTemplateOptions } = props;

  const classes = useStyles();

  const { query, contractStatus, contractTemplate, contractRole } = initialValues;
  const fixedValues = { query, contractStatus, contractTemplate, contractRole };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="ContractSearchForm"
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
            <SelectInput name="contractTemplate" options={contractTemplateOptions} multiple />
          </Grid>
          <Grid item xs={12}>
            <SelectInput multiple name="contractRole" options={ContractRole} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
