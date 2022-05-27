import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormikForm } from "@gemunion/mui-form";
import { Erc1155CollectionStatus, IErc1155CollectionSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc1155CollectionSearchFormProps {
  onSearch: (values: IErc1155CollectionSearchDto) => void;
  initialValues: IErc1155CollectionSearchDto;
  open: boolean;
}

export const Erc1155CollectionSearchForm: FC<IErc1155CollectionSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { query, collectionStatus } = initialValues;
  const fixedValues = { query, collectionStatus };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc1155CollectionSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" onSearch={onSearch} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="collectionStatus" options={Erc1155CollectionStatus} onSearch={onSearch} />
          </Grid>
        </Grid>
      </Collapse>
    </FormikForm>
  );
};
