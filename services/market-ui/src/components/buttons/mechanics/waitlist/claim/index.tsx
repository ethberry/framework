import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { useIntl } from "react-intl";
import { useApiCall } from "@gemunion/react-hooks";

import { useMetamask } from "@gemunion/react-hooks-eth";

import WaitlistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Waitlist/Waitlist.sol/Waitlist.json";

export interface IClaimWaitlistButtonProps {
  listId: number;
}

export const ClaimWaitlistButton: FC<IClaimWaitlistButtonProps> = props => {
  const { listId } = props;

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(
    async (api, listId) => {
      return api.fetchJson({
        url: `/waitlist/item/proof`,
        method: "POST",
        data: {
          listId,
        },
      });
    },
    { success: false },
  );

  const metaWaitlist = useMetamask((web3Context: Web3ContextType) => {
    return fn(null as unknown as any, listId).then((proof: { proof: Array<string> }) => {
      const contract = new Contract(process.env.WAITLIST_ADDR, WaitlistSol.abi, web3Context.provider?.getSigner());
      return contract.claim(proof.proof, listId) as Promise<void>;
    });
  });

  const handleClick = () => {
    return metaWaitlist();
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.waitlist" })}>
      <IconButton onClick={handleClick} data-testid="ClaimWaitlistButton">
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
