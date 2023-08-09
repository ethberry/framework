import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { useIntl } from "react-intl";
import { useApiCall } from "@gemunion/react-hooks";

import { useMetamask } from "@gemunion/react-hooks-eth";

import ClaimABI from "../../../../../abis/mechanics/wait-list/claim/claim.abi.json";
import { IWaitListItem } from "@framework/types";

export interface IWaitListClaimButtonProps {
  listItem: Partial<IWaitListItem>;
}

export const WaitListClaimButton: FC<IWaitListClaimButtonProps> = props => {
  const { listItem } = props;
  const { listId, list } = listItem;

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(
    async (api, listId) => {
      return api.fetchJson({
        url: `/wait-list/item/proof`,
        method: "POST",
        data: {
          listId,
        },
      });
    },
    { success: false },
  );

  const metaWaitList = useMetamask((web3Context: Web3ContextType) => {
    return fn(null as unknown as any, listId).then((proof: { proof: Array<string> }) => {
      const contract = new Contract(list!.contract.address, ClaimABI, web3Context.provider?.getSigner());
      return contract.claim(proof.proof, listId) as Promise<void>;
    });
  });

  const handleClick = () => {
    return metaWaitList();
  };

  if (list && !list.root) {
    return null;
  }

  return (
    <Tooltip title={formatMessage({ id: "form.tips.claim" })}>
      <IconButton onClick={handleClick} data-testid="ClaimWaitListButton">
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
