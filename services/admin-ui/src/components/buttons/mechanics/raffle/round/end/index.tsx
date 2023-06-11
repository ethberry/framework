import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { StopCircleOutlined } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";

import RaffleEndRoundABI from "../../../../../../abis/mechanics/lottery/round/end/endRound.abi.json";

export const RaffleRoundEndButton: FC = () => {
  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.RAFFLE_ADDR, RaffleEndRoundABI, web3Context.provider?.getSigner());
    return contract.endRound() as Promise<void>;
  });

  const handleEndRound = () => {
    return metaFn();
  };

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Button startIcon={<StopCircleOutlined />} onClick={handleEndRound} data-testid="RaffleRoundEndButton">
      <FormattedMessage id="pages.raffle.rounds.end" />
    </Button>
  );
};
