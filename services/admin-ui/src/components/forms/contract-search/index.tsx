import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ContractStatus, IContractSearchDto } from "@framework/types";
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

  const { query, contractStatus, contractTemplate } = initialValues;
  const fixedValues = { query, contractStatus, contractTemplate };

  const testIdPrefix = "ContractSearchForm";

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid={testIdPrefix}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" data-testid={`${testIdPrefix}-query`} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectInput
              name="contractStatus"
              options={ContractStatus}
              multiple
              data-testid={`${testIdPrefix}-contractStatus`}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              name="contractTemplate"
              options={contractTemplateOptions}
              multiple
              data-testid={`${testIdPrefix}-contractTemplate`}
            />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
