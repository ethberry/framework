import { FC, useEffect, useState } from "react";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import { AccessControlRoleType, type ILotteryRound } from "@framework/types";

import releaseFundsLotteryRandomABI from "@framework/abis/releaseFunds/LotteryRandom.json";
import { useCheckPermissions } from "../../../../../../utils/use-check-permissions";

export interface ILotteryReleaseButtonProps {
  className?: string;
  disabled?: boolean;
  round: ILotteryRound;
  variant?: ListActionVariant;
  onRefreshPage: () => Promise<void>;
}

export const LotteryReleaseButton: FC<ILotteryReleaseButtonProps> = props => {
  const { className, disabled, round, variant, onRefreshPage } = props;

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { fn: checkAccess } = useCheckPermissions();

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
      void checkAccess(void 0, {
        account,
        address: round.contract!.address,
        role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
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
      dataTestId="LotteryReleaseButton"
      disabled={disabled || !round.numbers || !round.endTimestamp || !release || !hasAccess}
      variant={variant}
    />
  );
};
