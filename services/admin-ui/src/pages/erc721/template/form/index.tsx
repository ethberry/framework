import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { Erc721TemplateStatus, IErc721TemplateSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ITemplateSearchFormProps {
  onSearch: (values: IErc721TemplateSearchDto) => void;
  initialValues: IErc721TemplateSearchDto;
  open: boolean;
}

export const Erc721TemplateSearchForm: FC<ITemplateSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { query, templateStatus, erc721CollectionIds } = initialValues;
  const fixedValues = { query, templateStatus, erc721CollectionIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721TemplateSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EntityInput name="erc721CollectionIds" controller="erc721-collections" multiple />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="templateStatus" options={Erc721TemplateStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSearch={onSearch} />
    </FormWrapper>
  );
};
