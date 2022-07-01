import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ContractStatus, IContractSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc1155ContractSearchFormProps {
  onSubmit: (values: IContractSearchDto) => Promise<void>;
  initialValues: IContractSearchDto;
  open: boolean;
}

export const Erc1155ContractSearchForm: FC<IErc1155ContractSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, contractStatus } = initialValues;
  const fixedValues = { query, contractStatus };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc1155CollectionSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="contractStatus" options={ContractStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
