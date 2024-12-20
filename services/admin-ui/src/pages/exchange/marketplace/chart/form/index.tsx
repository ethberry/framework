import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IMarketplaceReportSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

import { TemplateInput } from "../../../../../components/inputs/template";
import { FormRefresher } from "../../../../../components/forms/form-refresher";

interface IMarketplaceChartSearchFormProps {
  onSubmit: (values: IMarketplaceReportSearchDto) => Promise<void>;
  onRefreshPage: () => Promise<void>;
  initialValues: IMarketplaceReportSearchDto;
  open: boolean;
}

export const MarketplaceChartSearchForm: FC<IMarketplaceChartSearchFormProps> = props => {
  const { onSubmit, onRefreshPage, initialValues, open } = props;

  const { startTimestamp, endTimestamp, contractIds, templateIds } = initialValues;
  const fixedValues = { startTimestamp, endTimestamp, contractIds, templateIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="MarketplaceChartSearchForm"
    >
      <FormRefresher onRefreshPage={onRefreshPage} />
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
