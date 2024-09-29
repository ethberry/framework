import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@ethberry/mui-form";
import { DateTimeInput } from "@ethberry/mui-inputs-picker";
import type { IMarketplaceReportSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

import { TemplateInput } from "../../../../../components/inputs/template";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { SearchMerchantContractsInput } from "../../../../../components/inputs/search-merchant-contracts";

interface IMarketplaceChartSearchFormProps {
  onSubmit: (values: IMarketplaceReportSearchDto) => Promise<void>;
  initialValues: IMarketplaceReportSearchDto;
  open: boolean;
}

export const MarketplaceChartSearchForm: FC<IMarketplaceChartSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { startTimestamp, endTimestamp, merchantId, contractIds, templateIds } = initialValues;
  const fixedValues = { startTimestamp, endTimestamp, merchantId, contractIds, templateIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="MarketplaceChartSearchForm"
    >
      <Collapse in={open}>
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
              data={{ contractType: [TokenType.ERC721, TokenType.ERC1155] }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TemplateInput />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
