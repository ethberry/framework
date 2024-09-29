import { FC } from "react";
import { Grid } from "@mui/material";

import { DateTimeInput } from "@ethberry/mui-inputs-picker";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { IMarketplaceReportSearchDto, TokenType } from "@framework/types";

import { TemplateInput } from "../../../../../components/inputs/template";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { SearchMerchantContractsInput } from "../../../../../components/inputs/search-merchant-contracts";

interface IContractSearchFormProps {
  onSubmit: (values: IMarketplaceReportSearchDto) => Promise<void>;
  initialValues: IMarketplaceReportSearchDto;
  open: boolean;
  contractFeaturesOptions: Record<string, string>;
}

export const MarketplaceReportSearchForm: FC<IContractSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  return (
    <CommonSearchForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      open={open}
      testId="MarketplaceReportSearchForm"
    >
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
