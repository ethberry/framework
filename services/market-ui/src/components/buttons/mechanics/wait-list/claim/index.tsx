import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IWaitListItem } from "@framework/types";

import ClaimABI from "../../../../../abis/mechanics/wait-list/claim/claim.abi.json";

export interface IWaitListClaimButtonProps {
  className?: string;
  disabled?: boolean;
  listItem: Partial<IWaitListItem>;
  variant?: ListActionVariant;
}

export const WaitListClaimButton: FC<IWaitListClaimButtonProps> = props => {
  const { className, disabled, listItem, variant } = props;
  const { listId, list } = listItem;

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

  return (
    <ListAction
      onClick={handleClick}
      icon={Redeem}
      message="form.tips.claim"
      className={className}
      dataTestId="ClaimWaitListButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
