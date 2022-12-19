import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";

import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";

export const LotteryRoundEndButton: FC = () => {
  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.LOTTERY_ADDR, LotterySol.abi, web3Context.provider?.getSigner());
    return contract.endRound() as Promise<void>;
  });

  const handleRound = () => {
    return metaFn();
  };

  return (
    <Button startIcon={<Casino />} onClick={handleRound} data-testid="LotteryRoundEndButton">
      <FormattedMessage id="pages.lottery.rounds.end" />
    </Button>
  );
};
