import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { ILotteryRound } from "@framework/types";
import { AccessControlRoleType } from "@framework/types";

import releaseFundsLotteryABI from "@framework/abis/json/Lottery/releaseFunds.json";

import { useSetButtonPermission } from "../../../../../../../shared";

export interface ILotteryReleaseButtonProps {
  className?: string;
  disabled?: boolean;
  round: ILotteryRound;
  variant?: ListActionVariant;
  onRefreshPage: () => Promise<void>;
}

export const LotteryReleaseButton: FC<ILotteryReleaseButtonProps> = props => {
  const { className, disabled, round, variant, onRefreshPage } = props;

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, round.contract?.id);

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(round.contract!.address, releaseFundsLotteryABI, web3Context.provider?.getSigner());
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
      dataTestId="LotteryReleaseButton"
      disabled={disabled || !round.numbers || !round.endTimestamp || !release || !hasPermission}
      variant={variant}
    />
  );
};
