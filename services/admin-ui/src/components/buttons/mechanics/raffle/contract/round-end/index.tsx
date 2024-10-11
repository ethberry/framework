import { FC } from "react";
import { StopCircleOutlined } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType } from "@framework/types";
import { useMetamask } from "@ethberry/react-hooks-eth";

import RafflesEndRoundABI from "@framework/abis/json/Raffle/endRound.json";

import { shouldDisableByContractType } from "../../../../utils";
import { useSetButtonPermission } from "../../../../../../shared";

export interface IRaffleRoundEndButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RaffleRoundEndButton: FC<IRaffleRoundEndButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, parameters },
    disabled,
    variant,
  } = props;

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, contract?.id);

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, RafflesEndRoundABI, web3Context.provider?.getSigner());
    return contract.endRound() as Promise<void>;
  });

  const handleEndRound = () => {
    return metaFn();
  };

  // round not started
  if (!parameters.roundId) {
    return null;
  }

  return (
    <ListAction
      onClick={handleEndRound}
      icon={StopCircleOutlined}
      message="pages.raffle.rounds.end"
      className={className}
      dataTestId="RaffleRoundEndButton"
      disabled={disabled || shouldDisableByContractType(contract) || !hasPermission}
      variant={variant}
    />
  );
};
