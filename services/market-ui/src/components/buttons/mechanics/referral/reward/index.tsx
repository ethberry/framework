import { FC, useEffect, useState } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { constants, Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { useMetamask, useMetamaskValue } from "@gemunion/react-hooks-eth";

import ReferralWithdrawRewardABI from "../../../../../abis/exchange/referral/reward/withdrawReward.abi.json";
import ReferralGetBalanceABI from "../../../../../abis/exchange/referral/reward/getBalance.abi.json";

export interface IReferralRewardButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ReferralRewardButton: FC<IReferralRewardButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const [balance, setBalance] = useState("");
  const { isActive, account } = useWeb3React();

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(
      process.env.EXCHANGE_ADDR,
      ReferralWithdrawRewardABI,
      web3Context.provider?.getSigner(),
    );
    return contract.withdrawReward() as Promise<void>;
  });

  const handleWithdraw = () => {
    return metaFn();
  };

  // TODO add token selector for balance and get balances on demand only
  const getBalance = useMetamaskValue(
    (web3Context: Web3ContextType) => {
      const contract = new Contract(
        process.env.EXCHANGE_ADDR,
        ReferralGetBalanceABI,
        web3Context.provider?.getSigner(),
      );
      return contract.getBalance(account, constants.AddressZero) as Promise<string>;
    },
    { success: false },
  );

  useEffect(() => {
    if (isActive) {
      void getBalance().then(balance => {
        setBalance(balance.toString());
      });
    }
  }, [isActive]);

  return (
    <ListAction
      onClick={handleWithdraw}
      message="form.buttons.referralWithdraw"
      messageValues={{
        symbol: constants.EtherSymbol,
        amount: balance || "0",
      }}
      className={className}
      dataTestId="ReferralRewardButton"
      disabled={disabled || !balance || balance === "0"}
      variant={variant}
    />
  );
};
