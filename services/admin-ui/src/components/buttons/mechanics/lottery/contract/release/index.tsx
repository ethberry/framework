import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { ILotteryRound } from "@framework/types";

import LotteryReleaseABI from "../../../../../../abis/mechanics/lottery/round/release/releaseFunds.abi.json";

export interface ILotteryReleaseButtonProps {
  disabled?: boolean;
  round: ILotteryRound;
  variant?: ListActionVariant;
}

export const LotteryReleaseButton: FC<ILotteryReleaseButtonProps> = props => {
  const { disabled, round, variant } = props;

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
    <ListAction
      onClick={handleRelease()}
      icon={Redeem}
      message="form.tips.release"
      dataTestId="LotteryReleaseButton"
      disabled={disabled || !round.numbers || !round.endTimestamp || !release}
      variant={variant}
    />
  );
};
