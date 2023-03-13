import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyToken } from "@gemunion/mui-inputs-asset";
import { IToken, ITokenSearchDto, ModuleType, TokenType } from "@framework/types";

import MintBoxABI from "./mintBox.abi.json";

import { WrapperTokenListItem } from "./item";
import { ICreateWrappedToken, WrapperEditDialog } from "./edit";
import { TokenSearchForm } from "../../../../components/forms/token-search";

export interface IWrapperTokenListProps {
  embedded?: boolean;
}

export const WrapperTokenList: FC<IWrapperTokenListProps> = props => {
  const { embedded } = props;

  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    handleCreate,
    handleEditCancel,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
  } = useCollection<IToken, ITokenSearchDto>({
    baseUrl: "/wrapper-tokens",
    embedded,
  });

  const metaFn = useMetamask((values: ICreateWrappedToken, web3Context: Web3ContextType) => {
    const items = values.item.components.map(component => ({
      tokenType: Object.keys(TokenType).indexOf(component.tokenType),
      token: component.contract.address,
      tokenId: component.token.tokenId || 0,
      amount: component.amount,
    }));
    let totalValue = utils.parseEther("0");
    values.item.components.map(token => {
      if (token.tokenType === TokenType.NATIVE) {
        totalValue = totalValue.add(utils.parseUnits(token.amount, "wei"));
      }
      return token;
    });

    const contract = new Contract(values.contract.address, MintBoxABI, web3Context.provider?.getSigner());

    return contract.mintBox(web3Context.account, values.templateId, items, { value: totalValue }) as Promise<any>;
  });

  const handleEditConfirm = async (values: ICreateWrappedToken, _form: any) => {
    await metaFn(values);
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "wrapper.tokens"]} isHidden={embedded} />

      <PageHeader message="pages.wrapper.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
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
          {rows.map(token => (
            <Grid item lg={4} sm={6} xs={12} key={token.id}>
              <WrapperTokenListItem token={token} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <WrapperEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={{
          tokenType: TokenType.ERC721,
          contract: { address: constants.AddressZero },
          contractId: 0,
          templateId: 0,
          item: emptyToken,
        }}
      />
    </Fragment>
  );
};
