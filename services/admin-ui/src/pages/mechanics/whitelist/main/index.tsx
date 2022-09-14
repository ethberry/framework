import { FC, Fragment, useState } from "react";
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
import { IWhitelistGenerateDto, WhitelistGenerateDialog } from "./edit";
import { AccountDialog } from "../../../../components/dialogs/account";
import { emptyItem } from "../../../../components/inputs/price/empty-price";

export interface IProof {
  proof: string;
}

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

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/whitelist/generate`,
      });
    },
    { success: false },
  );

  const metaFn = useMetamask((values: IWhitelistGenerateDto, proof: IProof, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.WHITELIST_ADDR, WhitelistSol.abi, web3Context.provider?.getSigner());
    return contract.setReward(proof, values.item) as Promise<void>;
  });

  const handleUpload = () => {
    setIsGenerateDialogOpen(true);
  };

  const handleGenerateCancel = () => {
    setIsGenerateDialogOpen(false);
  };

  const handleGenerateConfirm = async (values: Record<string, any>) => {
    const proof = await fn();
    return metaFn(values, proof);
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

      <AccountDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        message={selected.id ? "dialogs.edit" : "dialogs.create"}
        testId="WhitelistEditDialog"
        initialValues={selected}
      />

      <WhitelistGenerateDialog
        onCancel={handleGenerateCancel}
        onConfirm={handleGenerateConfirm}
        open={isGenerateDialogOpen}
        initialValues={{ item: emptyItem }}
      />
    </Fragment>
  );
};
