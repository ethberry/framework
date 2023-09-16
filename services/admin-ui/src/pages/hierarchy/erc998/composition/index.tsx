import { FC, useState } from "react";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Add, Delete, FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IComposition, ICompositionSearchDto } from "@framework/types";
import { ContractStatus, ModuleType, TokenType } from "@framework/types";

import ERC998WhitelistChildABI from "../../../../abis/hierarchy/erc998/composition/whitelistChild.abi.json";

import { FormRefresher } from "../../../../components/forms/form-refresher";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { Erc998CompositionCreateDialog, IErc998CompositionCreateDto } from "./create";
import { Erc998CompositionViewDialog } from "./view";

export const Erc998Composition: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
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

  const handleDelete = (composition: IComposition) => {
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

  const handleCreateCancel = () => {
    return setIsCreateDialogOpen(false);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc998", "erc998.composition"]} />

      <PageHeader message="pages.erc998.composition.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
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
          <Grid item xs={6}>
            <EntityInput
              name="parentIds"
              controller="contracts"
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
            <EntityInput
              name="childIds"
              controller="contracts"
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
        <List>
          {rows.map(composition => (
            <ListItem key={composition.id}>
              <ListItemText sx={{ flex: "0 1 80%" }}>
                {composition.parent?.title} + {composition.child?.title}
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleView(composition)} icon={Visibility} message="form.tips.view" />
                <ListAction onClick={handleDelete(composition)} icon={Delete} message="form.tips.delete" />
              </ListActions>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
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
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
