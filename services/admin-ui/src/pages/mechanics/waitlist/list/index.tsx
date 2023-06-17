import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Add, Create, Delete, TimerOutlined } from "@mui/icons-material";

import { Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { IWaitListList, TokenType } from "@framework/types";
import type { ISearchDto } from "@gemunion/types-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyItem } from "@gemunion/mui-inputs-asset";

import WaitListSetRewardABI from "../../../../abis/mechanics/waitlist/list/setReward.abi.json";

import { WaitListSearchForm } from "./form";
import { WaitListListEditDialog } from "./edit";
import { IWaitListGenerateDto, WaitListGenerateDialog } from "./generate";

export interface IRoot {
  root: string;
}

export const WaitListList: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleEdit,
    handleCreate,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IWaitListList, ISearchDto>({
    baseUrl: "/waitlist/list",
    empty: {
      title: "",
      description: emptyStateString,
    },
    search: {
      query: "",
    },
  });

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const { fn } = useApiCall(
    async (api, values) => {
      return api.fetchJson({
        url: `/waitlist/list/generate`,
        method: "POST",
        data: {
          listId: values,
        },
      });
    },
    { success: false },
  );

  const metaFn = useMetamask((values: IWaitListGenerateDto, root: IRoot, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.WAITLIST_ADDR, WaitListSetRewardABI, web3Context.provider?.getSigner());

    const asset = values.item.components.map(component => ({
      tokenType: Object.values(TokenType).indexOf(component.tokenType),
      token: component.contract!.address,
      tokenId: component.templateId || 0,
      amount: component.amount,
    }));
    return contract.setReward(utils.arrayify(root.root), asset, values.listId) as Promise<void>;
  });

  const handleUpload = () => {
    setIsGenerateDialogOpen(true);
  };

  const handleGenerateCancel = () => {
    setIsGenerateDialogOpen(false);
  };

  const handleGenerateConfirm = async (values: Record<string, any>) => {
    const proof = await fn(null as unknown as any, values.listId);
    return metaFn(values, proof)
      .then(() => {
        setIsGenerateDialogOpen(false);
      })
      .catch(e => {
        console.error(e);
      });
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "waitlist", "waitlist.list"]} />

      <PageHeader message="pages.waitlist.list.title">
        <Button
          variant="outlined"
          startIcon={<TimerOutlined />}
          onClick={handleUpload}
          data-testid="WaitListUploadButton"
        >
          <FormattedMessage id={`form.buttons.upload`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <WaitListSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((waitListItem, i) => (
            <ListItem key={i}>
              <ListItemText>{waitListItem.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(waitListItem)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(waitListItem)}>
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
        initialValues={selected}
      />

      <WaitListListEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        message={selected.id ? "dialogs.edit" : "dialogs.create"}
        testId="WaitListListEditDialog"
        initialValues={selected}
      />

      <WaitListGenerateDialog
        onCancel={handleGenerateCancel}
        onConfirm={handleGenerateConfirm}
        open={isGenerateDialogOpen}
        initialValues={{
          item: emptyItem,
          listId: 1,
        }}
      />
    </Fragment>
  );
};
