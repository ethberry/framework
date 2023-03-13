import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";

import StartRoundABI from "./startRound.abi.json";

export const LotteryRoundStartButton: FC = () => {
  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.LOTTERY_ADDR, StartRoundABI, web3Context.provider?.getSigner());
    return contract.startRound() as Promise<void>;
  });

  const handleRound = () => {
    return metaFn();
  };

  return (
    <Button startIcon={<Casino />} onClick={handleRound} data-testid="LotteryRoundStartButton">
      <FormattedMessage id="pages.lottery.rounds.start" />
    </Button>
  );
};
