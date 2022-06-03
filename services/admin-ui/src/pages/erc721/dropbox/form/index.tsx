import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { Erc721CollectionType, Erc721DropboxStatus, IErc721DropboxSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface IDropboxSearchFormProps {
  onSearch: (values: IErc721DropboxSearchDto) => void;
  initialValues: IErc721DropboxSearchDto;
  open: boolean;
}

export const Erc721DropboxSearchForm: FC<IDropboxSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { query, dropboxStatus, erc721CollectionIds } = initialValues;
  const fixedValues = { query, dropboxStatus, erc721CollectionIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721DropboxSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EntityInput
              name="erc721CollectionIds"
              controller="erc721-collections"
              multiple
              data={{ collectionType: [Erc721CollectionType.DROPBOX] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="dropboxStatus" options={Erc721DropboxStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSearch={onSearch} />
    </FormWrapper>
  );
};
