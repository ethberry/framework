import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { IMarketplaceInsightsSearchDto, TokenType } from "@framework/types";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { useStyles } from "./styles";
import { TemplateInput } from "./template-input";

interface IMarketplaceInsightsSearchFormProps {
  onSubmit: (values: IMarketplaceInsightsSearchDto) => Promise<void>;
  initialValues: IMarketplaceInsightsSearchDto;
  open: boolean;
}

export const MarketplaceInsightsSearchForm: FC<IMarketplaceInsightsSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { startTimestamp, endTimestamp, contractIds, templateIds } = initialValues;
  const fixedValues = { startTimestamp, endTimestamp, contractIds, templateIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="ClaimSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <DateTimeInput name="startTimestamp" />
          </Grid>
          <Grid item xs={6}>
            <DateTimeInput name="endTimestamp" />
          </Grid>
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractType: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
            />
          </Grid>
          <Grid item xs={6}>
            <TemplateInput />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
