import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import type { IMarketplaceSupplySearchDto } from "@framework/types";
import { ContractFeatures, ContractStatus, TokenStatus, TokenType } from "@framework/types";

import { TemplateInput } from "../../../../../components/inputs/template";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { SearchMerchantContractsInput } from "../../../../../components/inputs/search-merchant-contracts";

interface IMarketplaceGradeSearchFormProps {
  onSubmit: (values: IMarketplaceSupplySearchDto) => Promise<any>;
  initialValues: IMarketplaceSupplySearchDto;
  open: boolean;
}

export const MarketplaceGradeSearchForm: FC<IMarketplaceGradeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { tokenStatus, tokenType, contractIds, templateIds, attribute, merchantId } = initialValues;
  const fixedValues = { tokenStatus, tokenType, contractIds, templateIds, attribute, merchantId };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="GradeSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SearchMerchantInput />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              name="tokenType"
              options={TokenType}
              disabledOptions={[TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="tokenStatus" options={TokenStatus} />
          </Grid>
          <Grid item xs={6}>
            <SearchMerchantContractsInput
              name="contractIds"
              data={{
                contractStatus: [ContractStatus.ACTIVE],
                contractFeatures: [ContractFeatures.DISCRETE],
              }}
              multiple
              withTokenType
            />
          </Grid>
          <Grid item xs={6}>
            <TemplateInput contractFeatures={[ContractFeatures.DISCRETE]} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
