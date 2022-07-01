import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ContractRole, ContractStatus, IContractSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc721ContractSearchFormProps {
  onSubmit: (values: IContractSearchDto) => Promise<void>;
  initialValues: IContractSearchDto;
  open: boolean;
}

export const Erc721ContractSearchForm: FC<IErc721ContractSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, contractStatus, contractRole } = initialValues;
  const fixedValues = { query, contractStatus, contractRole };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721CollectionSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput multiple name="contractStatus" options={ContractStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="contractRole" options={ContractRole} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
