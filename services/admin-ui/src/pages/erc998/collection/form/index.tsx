import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { UniContractStatus, UniContractType, IErc998CollectionSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc998CollectionSearchFormProps {
  onSubmit: (values: IErc998CollectionSearchDto) => Promise<void>;
  initialValues: IErc998CollectionSearchDto;
  open: boolean;
}

export const Erc998CollectionSearchForm: FC<IErc998CollectionSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, contractStatus, collectionType } = initialValues;
  const fixedValues = { query, contractStatus, collectionType };

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
            <SelectInput multiple name="collectionType" options={UniContractType} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
