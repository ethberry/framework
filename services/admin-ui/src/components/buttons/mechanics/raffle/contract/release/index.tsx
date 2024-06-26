import { FC, useEffect, useState } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IRaffleRound } from "@framework/types";
import releaseFundsLotteryRandomABI from "@framework/abis/releaseFunds/LotteryRandom.json";
import { useCheckAccess } from "../../../../../../utils/use-check-access";

export interface IRaffleReleaseButtonProps {
  className?: string;
  disabled?: boolean;
  round: IRaffleRound;
  onRefreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const RaffleReleaseButton: FC<IRaffleReleaseButtonProps> = props => {
  const { className, disabled, round, onRefreshPage = () => {}, variant } = props;

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkAccess } = useCheckAccess();

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(
      round.contract!.address,
      releaseFundsLotteryRandomABI,
      web3Context.provider?.getSigner(),
    );
    return contract.releaseFunds(round.roundId) as Promise<void>;
  });

  const handleRelease = (): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn().then(onRefreshPage);
    };
  };

  const timeAfterRound = Math.ceil((new Date().getTime() - new Date(round.endTimestamp).getTime()) / 1000);
  const release = timeAfterRound >= Number(round.contract!.parameters.timeLagBeforeRelease);

  useEffect(() => {
    if (account) {
      void checkAccess({
        account,
        address: round.contract!.address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [account]);

  return (
    <ListAction
      onClick={handleRelease()}
      icon={Redeem}
      message="form.tips.release"
      className={className}
      dataTestId="RaffleReleaseButton"
      disabled={disabled || !round.endTimestamp || !release || !hasAccess}
      variant={variant}
    />
  );
};
