import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { ILotteryRound } from "@framework/types";

import LotteryReleaseABI from "../../../../../abis/mechanics/lottery/round/release/releaseFunds.abi.json";

export interface ILotteryReleaseButtonProps {
  round: ILotteryRound;
}

export const LotteryReleaseButton: FC<ILotteryReleaseButtonProps> = props => {
  const { round } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(round.contract!.address, LotteryReleaseABI, web3Context.provider?.getSigner());
    return contract.releaseFunds(round.roundId) as Promise<void>;
  });

  const handleRelease = (): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn().then(() => {
        // TODO reload page
      });
    };
  };

  const timeAfterRound = Math.ceil((new Date().getTime() - new Date(round.endTimestamp).getTime()) / 1000);
  const release = timeAfterRound >= Number(round.contract!.parameters.timeLagBeforeRelease);

  return (
    <Tooltip title={formatMessage({ id: "form.tips.release" })}>
      <IconButton
        onClick={handleRelease()}
        disabled={!round.numbers || !round.endTimestamp || !release}
        data-testid="LotteryReleaseButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
