import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { UniContractStatus, UniContractRole, IErc998ContractSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc998CollectionSearchFormProps {
  onSubmit: (values: IErc998ContractSearchDto) => Promise<void>;
  initialValues: IErc998ContractSearchDto;
  open: boolean;
}

export const Erc998CollectionSearchForm: FC<IErc998CollectionSearchFormProps> = props => {
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
      data-testid="Erc998CollectionSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectInput multiple name="contractStatus" options={UniContractStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="contractRole" options={UniContractRole} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
