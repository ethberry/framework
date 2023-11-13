import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IRaffleRound } from "@framework/types";

import RaffleReleaseABI from "../../../../../../abis/mechanics/raffle/release/releaseFunds.abi.json";

export interface IRaffleReleaseButtonProps {
  className?: string;
  disabled?: boolean;
  round: IRaffleRound;
  onRefreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const RaffleReleaseButton: FC<IRaffleReleaseButtonProps> = props => {
  const { className, disabled, round, onRefreshPage = () => {}, variant } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(round.contract!.address, RaffleReleaseABI, web3Context.provider?.getSigner());
    return contract.releaseFunds(round.roundId) as Promise<void>;
  });

  const handleRelease = (): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn().then(onRefreshPage);
    };
  };

  const timeAfterRound = Math.ceil((new Date().getTime() - new Date(round.endTimestamp).getTime()) / 1000);
  const release = timeAfterRound >= Number(round.contract!.parameters.timeLagBeforeRelease);

  return (
    <ListAction
      onClick={handleRelease()}
      icon={Redeem}
      message="form.tips.release"
      className={className}
      dataTestId="RaffleReleaseButton"
      disabled={disabled || !round.endTimestamp || !release}
      variant={variant}
    />
  );
};
