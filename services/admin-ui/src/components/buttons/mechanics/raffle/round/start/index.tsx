import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { PlayCircleOutline } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";

import RaffleStartRoundABI from "../../../../../../abis/mechanics/lottery/round/start/startRound.abi.json";

export const RaffleRoundStartButton: FC = () => {
  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.RAFFLE_ADDR, RaffleStartRoundABI, web3Context.provider?.getSigner());
    return contract.startRound() as Promise<void>;
  });

  const handleStartRound = () => {
    return metaFn();
  };

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Button startIcon={<PlayCircleOutline />} onClick={handleStartRound} data-testid="RaffleRoundStartButton">
      <FormattedMessage id="pages.raffle.rounds.start" />
    </Button>
  );
};
