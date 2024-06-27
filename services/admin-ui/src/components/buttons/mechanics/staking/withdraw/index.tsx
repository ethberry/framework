import { FC, useEffect, useState } from "react";
import { RequestQuote } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IBalance } from "@framework/types";
import { AccessControlRoleType, TokenType } from "@framework/types";

import withdrawBalanceReentrancyStakingRewardABI from "@framework/abis/withdrawBalance/ReentrancyStakingReward.json";
import { useCheckPermissions } from "../../../../../utils/use-check-permissions";

export interface IStakingWithdrawButtonProps {
  balance: IBalance;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const StakingWithdrawButton: FC<IStakingWithdrawButtonProps> = props => {
  const { balance, className, disabled, variant } = props;

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { fn: checkAccess } = useCheckPermissions();

  const metaWithdraw = useMetamask(async (balance: IBalance, web3Context: Web3ContextType) => {
    const contract = new Contract(
      balance.account,
      withdrawBalanceReentrancyStakingRewardABI,
      web3Context.provider?.getSigner(),
    );

    return contract.withdrawBalance({
      tokenType: Object.keys(TokenType).indexOf(balance.token!.template!.contract!.contractType!),
      token: balance.token!.template!.contract?.address,
      tokenId: balance.token!.tokenId, // must match with staking.penalties[item.token][item.tokenId];
      amount: 0, // whatever
    }) as Promise<any>;
  });

  const handleClick = () => {
    return metaWithdraw(balance);
  };

  useEffect(() => {
    if (account) {
      void checkAccess(void 0, {
        account,
        address: balance.account,
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
      onClick={handleClick}
      icon={RequestQuote}
      message="form.tips.withdrawPenalty"
      className={className}
      dataTestId="StakingBalanceWithdrawButton"
      disabled={disabled || !hasAccess}
      variant={variant}
    />
  );
};
