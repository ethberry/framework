import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ContractStatus, Erc20ContractTemplate, IContractSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc20ContractSearchFormProps {
  onSubmit: (values: IContractSearchDto) => Promise<void>;
  initialValues: IContractSearchDto;
  open: boolean;
}

export const Erc20ContractSearchForm: FC<IErc20ContractSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, contractStatus, contractTemplate } = initialValues;
  const fixedValues = { query, contractStatus, contractTemplate };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc20TokenSearchForm"
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
            <SelectInput name="contractTemplate" options={Erc20ContractTemplate} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
