import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { Erc998CollectionType, Erc998DropboxStatus, IErc998DropboxSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface IDropboxSearchFormProps {
  onSubmit: (values: IErc998DropboxSearchDto) => Promise<void>;
  initialValues: IErc998DropboxSearchDto;
  open: boolean;
}

export const Erc998DropboxSearchForm: FC<IDropboxSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, dropboxStatus, erc998CollectionIds } = initialValues;
  const fixedValues = { query, dropboxStatus, erc998CollectionIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc998DropboxSearchForm"
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
              name="erc998CollectionIds"
              controller="erc998-collections"
              multiple
              data={{ collectionType: [Erc998CollectionType.DROPBOX] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="dropboxStatus" options={Erc998DropboxStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
