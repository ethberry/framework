import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { Add, FilterList } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IToken, ITokenSearchDto, ModuleType, TokenType } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC721TokenWrapperSol from "@framework/core-contracts/artifacts/contracts/Mechanics/TokenWrapper/ERC721TokenWrapper.sol/ERC721TokenWrapper.json";

import { WrapperTokenListItem } from "./item";
import { ICreateWrappedToken, WrapperEditDialog } from "./edit";
import { emptyPrice } from "../../../../components/inputs/price/empty-price";
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
    search: {
      contractIds: [],
    },
  });

  const metaFn = useMetamask((values: ICreateWrappedToken, web3Context: Web3ContextType) => {
    const contract = new Contract(values.address, ERC721TokenWrapperSol.abi, web3Context.provider?.getSigner());
    return contract.mintBox(web3Context.account, values.templateId, values.item) as Promise<any>;
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
          address: constants.AddressZero,
          contractId: 0,
          templateId: 0,
          item: emptyPrice,
        }}
      />
    </Fragment>
  );
};
