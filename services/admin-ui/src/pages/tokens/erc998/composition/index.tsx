import { FC, useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
  Tooltip,
} from "@mui/material";
import { Add, Delete, FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IComposition, ICompositionSearchDto } from "@framework/types";

import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";

import { Erc998CompositionViewDialog } from "./view";
import { Erc998CompositionSearchForm } from "./form";
import { Erc998CompositionCreateDialog, IErc998CompositionCreateDto } from "./create";

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
  } = useCollection<IComposition, ICompositionSearchDto>({
    baseUrl: "/erc998-composition",
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
    const contract = new Contract(composition.parent!.address, ERC998SimpleSol.abi, web3Context.provider?.getSigner());
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
      ERC998SimpleSol.abi,
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
      <Breadcrumbs path={["dashboard", "erc998.composition"]} />

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

      <Erc998CompositionSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((composition, i) => (
            <ListItem key={i}>
              <ListItemText>
                {composition.parent?.title} + {composition.child?.title}
              </ListItemText>
              <ListItemSecondaryAction>
                <Tooltip title={formatMessage({ id: "form.tips.view" })}>
                  <IconButton onClick={handleView(composition)}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                  <IconButton onClick={handleDelete(composition)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
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
