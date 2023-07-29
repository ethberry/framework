import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IRaffleRound } from "@framework/types";

import RaffleReleaseABI from "../../../../../abis/mechanics/raffle/release/releaseFunds.abi.json";

export interface ILotteryReleaseButtonProps {
  round: IRaffleRound;
  refreshPage?: () => Promise<void>;
}

export const RaffleReleaseButton: FC<ILotteryReleaseButtonProps> = props => {
  const { round, refreshPage = () => {} } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(round.contract!.address, RaffleReleaseABI, web3Context.provider?.getSigner());
    return contract.releaseFunds(round.roundId) as Promise<void>;
  });

  const handleRelease = (): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn().then(refreshPage);
    };
  };

  const timeAfterRound = Math.ceil((new Date().getTime() - new Date(round.endTimestamp).getTime()) / 1000);
  const release = timeAfterRound >= Number(round.contract!.parameters.timeLagBeforeRelease);

  return (
    <Tooltip title={formatMessage({ id: "form.tips.release" })}>
      <IconButton
        onClick={handleRelease()}
        disabled={!round.endTimestamp || !release}
        data-testid="RaffleReleaseButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
