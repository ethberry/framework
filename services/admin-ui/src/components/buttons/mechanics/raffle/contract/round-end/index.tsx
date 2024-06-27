import { FC, useEffect, useState } from "react";
import { StopCircleOutlined } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import RafflesEndRoundABI from "@framework/abis/endRound/LotteryRandom.json";

import { shouldDisableByContractType } from "../../../../utils";
import { useCheckPermissions } from "../../../../../../utils/use-check-permissions";

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

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, RafflesEndRoundABI, web3Context.provider?.getSigner());
    return contract.endRound() as Promise<void>;
  });

  const handleEndRound = () => {
    return metaFn();
  };

  useEffect(() => {
    if (account) {
      void checkPermissions({
        account,
        address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [account]);

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
      disabled={disabled || shouldDisableByContractType(contract) || !hasAccess}
      variant={variant}
    />
  );
};
