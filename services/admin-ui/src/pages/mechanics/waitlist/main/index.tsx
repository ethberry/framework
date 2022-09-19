import { FC, Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Add, Delete, TimerOutlined } from "@mui/icons-material";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";

import { Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { IWaitlist, IWaitlistSearchDto, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import WaitlistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Waitlist/Waitlist.sol/Waitlist.json";

import { WaitlistSearchForm } from "./form";
import { IWaitlistGenerateDto, WaitlistGenerateDialog } from "./edit";
import { IWaitlistClaimDto, WaitlistClaimDialog } from "./claim";
import { emptyItem } from "../../../../components/inputs/price/empty-price";
import { WaitlistDialog } from "../../../../components/dialogs/waitlist";

export interface IProof {
  proof: Array<string>;
}

export interface IRoot {
  root: string;
}

export const Waitlist: FC = () => {
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
  } = useCollection<IWaitlist, IWaitlistSearchDto>({
    baseUrl: "/waitlist",
    empty: {
      account: process.env.ACCOUNT,
    },
    search: {
      account: "",
    },
  });

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const { fn: fn1 } = useApiCall(
    async (api, values) => {
      return api.fetchJson({
        url: `/waitlist/generate`,
        method: "POST",
        data: {
          listId: values,
        },
      });
    },
    { success: false },
  );

  const { fn: fn2 } = useApiCall(
    async (api, values) => {
      return api.fetchJson({
        url: `/waitlist/proof`,
        method: "POST",
        data: {
          listId: values.listId,
          account: values.account,
        },
      });
    },
    { success: false },
  );

  const metaFn = useMetamask((values: IWaitlistGenerateDto, root: IRoot, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.WAITLIST_ADDR, WaitlistSol.abi, web3Context.provider?.getSigner());

    const asset = values.item.components.map(component => ({
      tokenType: Object.keys(TokenType).indexOf(component.tokenType),
      token: component.contract!.address,
      tokenId: component.templateId || 0,
      amount: component.amount,
    }));
    return contract.setReward(utils.arrayify(root.root), asset, values.listId) as Promise<void>;
  });

  const metaFnClaim = useMetamask((values: IWaitlistClaimDto, proof: IProof, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.WAITLIST_ADDR, WaitlistSol.abi, web3Context.provider?.getSigner());
    return contract.claim(proof.proof, values.listId) as Promise<void>;
  });

  const handleUpload = () => {
    setIsGenerateDialogOpen(true);
  };

  const handleClaim = () => {
    setIsClaimDialogOpen(true);
  };

  const handleGenerateCancel = () => {
    setIsGenerateDialogOpen(false);
  };

  const handleClaimCancel = () => {
    setIsClaimDialogOpen(false);
  };

  const handleGenerateConfirm = async (values: Record<string, any>) => {
    const proof = await fn1(null as unknown as any, values.listId);
    return metaFn(values, proof)
      .then(() => {
        setIsGenerateDialogOpen(false);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handleClaimConfirm = async (values: Partial<IWaitlistClaimDto>) => {
    const proof = await fn2(null as unknown as any, values);
    return metaFnClaim(values, proof)
      .then(() => {
        setIsClaimDialogOpen(false);
      })
      .catch(e => {
        console.error(e);
      });
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "waitlist"]} />

      <PageHeader message="pages.waitlist.title">
        <Button
          variant="outlined"
          startIcon={<AccessibleForwardIcon />}
          onClick={handleClaim}
          data-testid="WaitlistClaimButton"
        >
          <FormattedMessage id={`form.buttons.claim`} />
        </Button>
        <Button
          variant="outlined"
          startIcon={<TimerOutlined />}
          onClick={handleUpload}
          data-testid="WaitlistUploadButton"
        >
          <FormattedMessage id={`form.buttons.upload`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitlistCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <WaitlistSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((waitlist, i) => (
            <ListItem key={i}>
              <ListItemText>{waitlist.account}</ListItemText>
              <ListItemText>{waitlist.listId}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleDelete(waitlist)}>
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
          title: formatMessage({ id: "pages.waitlist.defaultItemTitle" }, { account: selected.account }),
        }}
      />

      <WaitlistDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        message={selected.id ? "dialogs.edit" : "dialogs.create"}
        testId="WaitlistEditDialog"
        initialValues={selected}
      />

      <WaitlistGenerateDialog
        onCancel={handleGenerateCancel}
        onConfirm={handleGenerateConfirm}
        open={isGenerateDialogOpen}
        initialValues={{ item: emptyItem, listId: 1 }}
      />

      <WaitlistClaimDialog
        onCancel={handleClaimCancel}
        onConfirm={handleClaimConfirm}
        open={isClaimDialogOpen}
        initialValues={{ account: process.env.ACCOUNT, listId: 1 }}
      />
    </Fragment>
  );
};
