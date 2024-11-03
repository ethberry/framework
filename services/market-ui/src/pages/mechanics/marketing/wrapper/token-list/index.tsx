import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid } from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { CollectionActions, useCollection } from "@ethberry/provider-collection";
import { useAllowance, useMetamask } from "@ethberry/react-hooks-eth";
import { emptyToken } from "@ethberry/mui-inputs-asset";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { IAsset, IToken, ITokenSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";
import { getEthPrice } from "@framework/exchange";

import ERC721WrapperMintBoxABI from "@framework/abis/json/ERC721Wrapper/mintBox.json";

import { TokenSearchForm } from "../../../../../components/forms/token-search";
import type { ICreateWrappedToken } from "./edit";
import { WrapperEditDialog } from "./edit";
import { WrapperTokenListItem } from "./item";

export interface IWrapperTokenListProps {
  embedded?: boolean;
}

export const WrapperTokenList: FC<IWrapperTokenListProps> = props => {
  const { embedded } = props;

  const {
    rows,
    count,
    search,
    action,
    isLoading,
    isFiltersOpen,
    handleCreate,
    handleEditCancel,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
  } = useCollection<IToken, ITokenSearchDto>({
    baseUrl: "/wrapper/tokens",
    embedded,
  });

  const metaFnWithAllowance = useAllowance((web3Context: Web3ContextType, values: ICreateWrappedToken) => {
    // do not use convertTemplateToChainAsset
    const content = values.item.components.map(component => ({
      tokenType: Object.values(TokenType).indexOf(component.tokenType),
      token: component.template.contract.address,
      tokenId: component.token.tokenId, // <- custom
      amount: component.amount,
    }));

    const contract = new Contract(values.contract.address, ERC721WrapperMintBoxABI, web3Context.provider?.getSigner());
    return contract.mintBox(web3Context.account, values.templateId, content, {
      value: getEthPrice(values.item as unknown as IAsset),
    }) as Promise<any>;
  });

  const metaFn = useMetamask((values: ICreateWrappedToken, web3Context: Web3ContextType) => {
    // do not use convertTemplateToChainAsset
    const assets = values.item.components.map(component => ({
      tokenType: component.tokenType, // <- custom
      token: component.template.contract.address,
      tokenId: component.token.tokenId, // <- custom
      amount: component.amount,
    }));

    return metaFnWithAllowance(
      {
        contract: values.contract.address,
        assets,
      },
      web3Context,
      values,
    );
  });

  const handleEditConfirm = async (values: ICreateWrappedToken, _form: any) => {
    await metaFn(values);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "wrapper.tokens"]} isHidden={embedded} />

      <PageHeader message="pages.wrapper.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WrapperCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC721]}
        contractModule={[ModuleType.WRAPPER]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(token => (
              <Grid item lg={4} sm={6} xs={12} key={token.id}>
                <WrapperTokenListItem token={token} />
              </Grid>
            ))}
          </StyledEmptyWrapper>
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <WrapperEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={{
          tokenType: TokenType.ERC721,
          contract: { address: constants.AddressZero },
          contractId: 0,
          templateId: 0,
          item: emptyToken,
        }}
      />
    </Grid>
  );
};
