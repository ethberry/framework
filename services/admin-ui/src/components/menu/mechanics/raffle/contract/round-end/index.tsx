import { FC } from "react";
import { StopCircleOutlined } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { NodeEnv } from "@framework/types";

import RaffleEndRoundABI from "../../../../../../abis/mechanics/lottery/round/end/endRound.abi.json";

export interface IRaffleRoundEndMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RaffleRoundEndMenuItem: FC<IRaffleRoundEndMenuItemProps> = props => {
  const {
    contract: { address },
    disabled,
    variant,
  } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, RaffleEndRoundABI, web3Context.provider?.getSigner());
    return contract.endRound() as Promise<void>;
  });

  const handleEndRound = () => {
    return metaFn();
  };

  if (process.env.NODE_ENV === NodeEnv.production) {
    return null;
  }

  return (
    <ListAction
      onClick={handleEndRound}
      dataTestId="RaffleRoundEndButton"
      icon={StopCircleOutlined}
      message="pages.raffle.rounds.end"
      disabled={disabled}
      variant={variant}
    />
  );
};
