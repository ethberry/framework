import { FC } from "react";
import { RequestQuote } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IBalance } from "@framework/types";
import { TokenType } from "@framework/types";

import StakingWithdrawABI from "../../../../../abis/mechanics/staking/stakingWithdraw.abi.json";

export interface IStakingWithdrawButtonProps {
  balance: IBalance;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const StakingWithdrawButton: FC<IStakingWithdrawButtonProps> = props => {
  const { balance, className, disabled, variant } = props;

  const metaWithdraw = useMetamask(async (balance: IBalance, web3Context: Web3ContextType) => {
    const contract = new Contract(balance.account, StakingWithdrawABI, web3Context.provider?.getSigner());

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

  return (
    <ListAction
      onClick={handleClick}
      icon={RequestQuote}
      message="form.tips.withdrawPenalty"
      className={className}
      dataTestId="StakingBalanceWithdrawButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
