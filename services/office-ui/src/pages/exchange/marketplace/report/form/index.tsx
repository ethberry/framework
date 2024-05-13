import { FC } from "react";
import { Grid } from "@mui/material";

import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { IMarketplaceReportSearchDto, TokenType } from "@framework/types";

import { TemplateInput } from "../../../../../components/inputs/template";
import { FormRefresher } from "../../../../../components/forms/form-refresher";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { SearchMerchantContractsInput } from "../../../../../components/inputs/search-merchant-contracts";

interface IContractSearchFormProps {
  onSubmit: (values: IMarketplaceReportSearchDto) => Promise<void>;
  initialValues: IMarketplaceReportSearchDto;
  open: boolean;
  contractFeaturesOptions: Record<string, string>;
  onRefreshPage: () => Promise<void>;
}

export const ReportSearchForm: FC<IContractSearchFormProps> = props => {
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
        <Grid item xs={12}>
          <SearchMerchantInput />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateTimeInput name="startTimestamp" />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateTimeInput name="endTimestamp" />
        </Grid>
        <Grid item xs={12} md={6}>
          <SearchMerchantContractsInput
            name="contractIds"
            multiple
            data={{ contractType: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TemplateInput />
        </Grid>
      </Grid>
    </CommonSearchForm>
  );
};
