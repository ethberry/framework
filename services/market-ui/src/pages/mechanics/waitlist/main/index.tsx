import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";

import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { FormattedMessage } from "react-intl";

import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { WaitlistDialog } from "../../../../components/dialogs/waitlist";

import WaitlistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Waitlist/Waitlist.sol/Waitlist.json";
import { IWaitlist, IWaitlistSearchDto } from "@framework/types";

export interface IProof {
  proof: Array<string>;
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
    handleClaimCancel,
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
  const { account } = useWeb3React();

  const { fn } = useApiCall(async api => {
    return api.fetchJson({
      url: `/waitlist/add`,
      method: "POST",
      data: {
        account,
      },
    });
  });

  const metaFnClaim = useMetamask((proof: IProof, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.WAITLIST_ADDR, WaitlistSol.abi, web3Context.provider?.getSigner());
    console.log("proof", proof.proof);
    return contract.claim(proof.proof, 222) as Promise<void>;
  });

  const handleAddToWaitlist = () => {
    return fn();
  };

  const { fn: fn2 } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/waitlist/proof`,
      });
    },
    { success: false },
  );

  const handleClaimConfirm = async () => {
    const proof = await fn2();
    return metaFnClaim(proof);
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "waitlist"]} />

      <PageHeader message="pages.waitlist.title" />

      <Button
        variant="outlined"
        startIcon={<AccessibleForwardIcon />}
        onClick={handleClaimConfirm}
        data-testid="WaitlistClaimButton"
      >
        <FormattedMessage id={`form.buttons.claim`} />
      </Button>
      <Button variant="outlined" startIcon={<Add />} onClick={handleAddToWaitlist} data-testid="WaitlistAddButton">
        <FormattedMessage id="form.buttons.add" />
      </Button>

      <WaitlistDialog
        onCancel={handleClaimCancel}
        onConfirm={handleClaimConfirm}
        open={isEditClaimOpen}
        message={selected.id ? "dialogs.edit" : "dialogs.create"}
        testId="WaitlistEditDialog"
        initialValues={selected}
      />
    </Fragment>
  );
};
