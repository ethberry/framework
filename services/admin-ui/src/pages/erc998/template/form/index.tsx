import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { IErc998TemplateSearchDto, UniTemplateStatus } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ITemplateSearchFormProps {
  onSubmit: (values: IErc998TemplateSearchDto) => Promise<void>;
  initialValues: IErc998TemplateSearchDto;
  open: boolean;
}

export const Erc998TemplateSearchForm: FC<ITemplateSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, templateStatus, uniContractIds } = initialValues;
  const fixedValues = { query, templateStatus, uniContractIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc998TemplateSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <EntityInput name="uniContractIds" controller="erc998-collections" multiple />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="templateStatus" options={UniTemplateStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
