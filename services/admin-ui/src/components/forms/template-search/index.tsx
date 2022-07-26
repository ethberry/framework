import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ITemplateSearchDto, TemplateStatus, TokenType } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";

interface ITemplateSearchFormProps {
  onSubmit: (values: ITemplateSearchDto) => Promise<void>;
  initialValues: ITemplateSearchDto;
  open: boolean;
  contractType: Array<TokenType>;
}

export const TemplateSearchForm: FC<ITemplateSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType } = props;

  const classes = useStyles();

  const { query, templateStatus, contractIds } = initialValues;
  const fixedValues = { query, templateStatus, contractIds };

  const testIdPrefix = "TemplateSearchForm";

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid={testIdPrefix}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" data-testid={`${testIdPrefix}-query`} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractType }}
              data-testid={`${testIdPrefix}-contractIds`}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="templateStatus"
              options={TemplateStatus}
              data-testid={`${testIdPrefix}-templateStatus`}
            />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
