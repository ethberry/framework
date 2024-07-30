import { FC, useState } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, FilterList, PauseCircleOutline, PlayCircleOutline, Visibility } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import { CompositionStatus, ContractStatus, ModuleType, TokenType } from "@framework/types";
import type { IComposition, ICompositionSearchDto, IUser } from "@framework/types";

import ERC998WhitelistChildABI from "@framework/abis/json/ERC998Simple/whiteListChild.json";

import { FormRefresher } from "../../../../components/forms/form-refresher";
import { SearchMerchantContractsInput } from "../../../../components/inputs/search-merchant-contracts";
import { SearchMerchantInput } from "../../../../components/inputs/search-merchant";
import { Erc998CompositionCreateDialog, IErc998CompositionCreateDto } from "./create";
import { Erc998CompositionViewDialog } from "./view";

export const Erc998Composition: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleView,
    handleViewCancel,
    handleViewConfirm,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IComposition, ICompositionSearchDto>({
    baseUrl: "/erc998/composition",
    empty: {
      amount: 0,
    },
    search: {
      parentIds: [],
      childIds: [],
      merchantId: profile.merchantId,
    },
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn1 = useMetamask((composition: IComposition, web3Context: Web3ContextType) => {
    const contract = new Contract(
      composition.parent!.address,
      ERC998WhitelistChildABI,
      web3Context.provider?.getSigner(),
    );
    return contract.unWhitelistChild(composition.child!.address) as Promise<void>;
  });

  const handleDeactivate = (composition: IComposition) => {
    return () => {
      return metaFn1(composition);
    };
  };

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const metaFn2 = useMetamask((composition: IErc998CompositionCreateDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      composition.contract.parent.contract,
      ERC998WhitelistChildABI,
      web3Context.provider?.getSigner(),
    );
    return contract.whiteListChild(composition.contract.child.contract, composition.amount) as Promise<void>;
  });

  const handleCreateConfirm = (values: IErc998CompositionCreateDto) => {
    return metaFn2(values).finally(() => {
      setIsCreateDialogOpen(false);
    });
  };

  const handleActivate = (composition: IComposition) => {
    const values = {
      contract: {
        parent: {
          contract: composition.parent!.address,
        },
        child: {
          contract: composition.child!.address,
        },
      },
      amount: `${composition.amount}`,
    };

    return () => {
      return handleCreateConfirm(values);
    };
  };

  const handleCreateCancel = () => {
    return setIsCreateDialogOpen(false);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc998", "erc998.composition"]} />

      <PageHeader message="pages.erc998.composition.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleCreate}
          data-testid="Erc998CompositionCreateButton"
        >
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="Erc998CompositionSearchForm"
      >
        <FormRefresher onRefreshPage={handleRefreshPage} />
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={6}>
            <SearchMerchantContractsInput
              name="parentIds"
              multiple
              data={{
                contractType: [TokenType.ERC998],
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
                contractModule: [ModuleType.HIERARCHY],
              }}
              label={formatMessage({ id: "form.labels.parent" })}
            />
          </Grid>
          <Grid item xs={6}>
            <SearchMerchantContractsInput
              name="childIds"
              multiple
              data={{
                contractType: [TokenType.ERC20, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
                contractModule: [ModuleType.HIERARCHY],
              }}
              label={formatMessage({ id: "form.labels.child" })}
            />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(composition => (
            <StyledListItem key={composition.id}>
              <ListItemText sx={{ flex: "0 1 80%" }}>
                {composition.parent?.title} + {composition.child?.title}
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleView(composition)} message="form.tips.view" icon={Visibility} />
                {composition.compositionStatus === CompositionStatus.ACTIVE ? (
                  <ListAction
                    onClick={handleDeactivate(composition)}
                    message="form.buttons.deactivate"
                    icon={PauseCircleOutline}
                  />
                ) : (
                  <ListAction
                    onClick={handleActivate(composition)}
                    message="form.buttons.activate"
                    icon={PlayCircleOutline}
                  />
                )}
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <Erc998CompositionCreateDialog
        onCancel={handleCreateCancel}
        onConfirm={handleCreateConfirm}
        open={isCreateDialogOpen}
      />

      <Erc998CompositionViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
