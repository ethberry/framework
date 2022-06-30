import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { DropboxStatus, IDropboxSearchDto, ContractRole } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface IDropboxSearchFormProps {
  onSubmit: (values: IDropboxSearchDto) => Promise<void>;
  initialValues: IDropboxSearchDto;
  open: boolean;
}

export const Erc721DropboxSearchForm: FC<IDropboxSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, dropboxStatus, contractIds } = initialValues;
  const fixedValues = { query, dropboxStatus, contractIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
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
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="uni-collections"
              multiple
              data={{ contractType: [ContractRole.DROPBOX] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="dropboxStatus" options={DropboxStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
