import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormikForm } from "@gemunion/mui-form";
import { Erc721CollectionStatus, Erc721CollectionType, IErc721CollectionSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc721CollectionSearchFormProps {
  onSubmit: (values: IErc721CollectionSearchDto) => void;
  initialValues: IErc721CollectionSearchDto;
  open: boolean;
}

export const Erc721CollectionSearchForm: FC<IErc721CollectionSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, collectionStatus, collectionType } = initialValues;
  const fixedValues = { query, collectionStatus, collectionType };

  return (
    <FormikForm
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectInput multiple name="collectionStatus" options={Erc721CollectionStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="collectionType" options={Erc721CollectionType} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave />
    </FormikForm>
  );
};
