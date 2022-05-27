import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormikForm } from "@gemunion/mui-form";
import { SearchInput, TextInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc1155TokenStatus, IErc1155TokenSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface ITokenSearchFormProps {
  onSearch: (values: IErc1155TokenSearchDto) => void;
  initialValues: IErc1155TokenSearchDto;
  open: boolean;
}

export const Erc1155TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { query, erc1155CollectionIds, tokenId, tokenStatus } = initialValues;
  const fixedValues = { query, erc1155CollectionIds, tokenId, tokenStatus };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc1155TokenSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" onSearch={onSearch} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EntityInput name="erc1155CollectionIds" controller="erc1155-collections" onSearch={onSearch} multiple />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="tokenStatus" options={Erc1155TokenStatus} onSearch={onSearch} />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="tokenId" onSearch={onSearch} />
          </Grid>
        </Grid>
      </Collapse>
    </FormikForm>
  );
};
