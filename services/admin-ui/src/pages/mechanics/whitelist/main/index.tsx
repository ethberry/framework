import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Add, Delete, TimerOutlined } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { IWhitelist, IWhitelistSearchDto } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import WhitelistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Whitelist/Whitelist.sol/Whitelist.json";

import { WhitelistSearchForm } from "./form";
import { WhitelistEditDialog } from "./edit";

export const Whitelist: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleCreate,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IWhitelist, IWhitelistSearchDto>({
    baseUrl: "/whitelist",
    empty: {
      account: "",
    },
    search: {
      account: "",
    },
  });

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async api => {
    return api.fetchJson({
      url: `/whitelist/generate`,
    });
  });

  const metaFn = useMetamask((proof: string, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.WHITELIST_ADDR, WhitelistSol.abi, web3Context.provider?.getSigner());
    return contract.setReward(proof, []) as Promise<void>;
  });

  const handleUpload = async () => {
    const { proof } = await fn();
    return metaFn(proof);
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "whitelist"]} />

      <PageHeader message="pages.whitelist.title">
        <Button
          variant="outlined"
          startIcon={<TimerOutlined />}
          onClick={handleUpload}
          data-testid="WhitelistUploadButton"
        >
          <FormattedMessage id={`form.buttons.upload`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WhitelistCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <WhitelistSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((whitelist, i) => (
            <ListItem key={i}>
              <ListItemText>{whitelist.account}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleDelete(whitelist)}>
                  <Delete />
                </IconButton>
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={{
          ...selected,
          title: formatMessage({ id: "pages.whitelist.defaultItemTitle" }, { account: selected.account }),
        }}
      />

      <WhitelistEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Fragment>
  );
};
