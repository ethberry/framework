import { FC, Fragment } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@ethberry/mui-form";
import type { ITokenSearchDto } from "@framework/types";
import { ModuleType, TokenMetadata, TokenRarity, TokenStatus, TokenType } from "@framework/types";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";

import { SearchMerchantInput } from "../../inputs/search-merchant";
import { SearchMerchantContractsInput } from "../../inputs/search-merchant-contracts";
import { TemplateInput } from "../../inputs/template";

interface ITokenSearchFormProps {
  onSubmit: (values: ITokenSearchDto) => Promise<void>;
  initialValues: ITokenSearchDto;
  open: boolean;
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
}

export const TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open, contractType, contractModule } = props;

  const { query, tokenStatus, contractIds, templateIds, tokenId, metadata, merchantId } = initialValues;
  const fixedValues = {
    query,
    tokenStatus,
    contractIds,
    templateIds,
    tokenId,
    metadata: Object.assign(
      {
        [TokenMetadata.RARITY]: [],
        [TokenMetadata.LEVEL]: [],
      },
      metadata,
    ),
    merchantId,
  };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={({ tokenId, ...rest }: any) => onSubmit(tokenId === "" ? rest : { tokenId, ...rest })}
      showButtons={false}
      showPrompt={false}
      testId="TokenSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={6}>
            <SearchMerchantContractsInput name="contractIds" multiple data={{ contractType, contractModule }} />
          </Grid>
          <Grid item xs={6}>
            <TemplateInput />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="tokenId" normalizeValue={(value: string | undefined) => value ?? ""} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="tokenStatus" options={TokenStatus} multiple />
          </Grid>
          {contractType.filter(value => [TokenType.ERC721, TokenType.ERC998].includes(value)).length &&
          contractModule.filter(value => [ModuleType.HIERARCHY].includes(value)).length ? (
            <Fragment>
              <Grid item xs={6}>
                <SelectInput name={`metadata.${TokenMetadata.RARITY}`} options={TokenRarity} multiple />
              </Grid>
              <Grid item xs={6}>
                <SelectInput
                  name={`metadata.${TokenMetadata.LEVEL}`}
                  options={new Array(10)
                    .fill(null)
                    .reduce((memo: Record<string, string>, value, i) => Object.assign(memo, { [i + 1]: i + 1 }), {})}
                  multiple
                />
              </Grid>
            </Fragment>
          ) : null}
        </Grid>
      </Collapse>
      <AutoSave onSubmit={({ tokenId, ...rest }: any) => onSubmit(tokenId === "" ? rest : { tokenId, ...rest })} />
    </FormWrapper>
  );
};
