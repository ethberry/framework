import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { IErc998TemplateSearchDto } from "@framework/types";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { useStyles } from "./styles";

interface IUniTemplateSearchFormProps {
  onSubmit: (values: IErc998TemplateSearchDto) => Promise<void>;
  initialValues: IErc998TemplateSearchDto;
  open: boolean;
  embedded?: boolean;
}

export const Erc998TemplateSearchForm: FC<IUniTemplateSearchFormProps> = props => {
  const { onSubmit, initialValues, open, embedded } = props;

  const classes = useStyles();

  const { query, uniContractIds, minPrice, maxPrice } = initialValues;
  const fixedValues = { query, uniContractIds, minPrice, maxPrice };

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
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EthInput name="minPrice" />
          </Grid>
          <Grid item xs={6}>
            <EthInput name="maxPrice" />
          </Grid>
          {!embedded ? (
            <Grid item xs={6}>
              <EntityInput name="uniContractIds" controller="erc998-collections" multiple />
            </Grid>
          ) : null}
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
