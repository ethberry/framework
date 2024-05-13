import { FC } from "react";
import { Grid } from "@mui/material";

import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { IMarketplaceReportSearchDto, TokenType } from "@framework/types";

import { TemplateInput } from "../../../../../components/inputs/template";
import { FormRefresher } from "../../../../../components/forms/form-refresher";

interface IContractSearchFormProps {
  onSubmit: (values: IMarketplaceReportSearchDto) => Promise<void>;
  initialValues: IMarketplaceReportSearchDto;
  open: boolean;
  contractFeaturesOptions: Record<string, string>;
  onRefreshPage: () => Promise<void>;
}

export const MarketplaceReportSearchForm: FC<IContractSearchFormProps> = props => {
  const { onSubmit, onRefreshPage, initialValues, open } = props;

  return (
    <CommonSearchForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      open={open}
      testId="MarketplaceReportSearchForm"
    >
      <FormRefresher onRefreshPage={onRefreshPage} />
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
    </CommonSearchForm>
  );
};
