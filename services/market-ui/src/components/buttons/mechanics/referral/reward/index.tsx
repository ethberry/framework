import { FC, useEffect, useState } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { constants, Contract } from "ethers";

import { useMetamask, useMetamaskValue, useSystemContract } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { SystemModuleType } from "@framework/types";

import ReferralWithdrawRewardABI from "@framework/abis/withdrawReward/LinearReferralPonzi.json";
import ReferralGetBalanceABI from "@framework/abis/getBalance/LinearReferralPonzi.json";

export interface IReferralRewardButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ReferralRewardButton: FC<IReferralRewardButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const [balance, setBalance] = useState("");
  const { isActive, account } = useWeb3React();

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (_values: null, web3Context: Web3ContextType, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ReferralWithdrawRewardABI,
        web3Context.provider?.getSigner(),
      );
      return contract.withdrawReward() as Promise<void>;
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.EXCHANGE, null, web3Context);
  });

  const handleWithdraw = () => {
    return metaFn();
  };

  // TODO add token selector for balance and get balances on demand only
  const getBalanceWithContract = useSystemContract<IContract, SystemModuleType>(
    (_values: null, web3Context: Web3ContextType, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, ReferralGetBalanceABI, web3Context.provider?.getSigner());
      return contract.getBalance(account, constants.AddressZero) as Promise<string>;
    },
    { success: false },
  );

  const getBalance = useMetamaskValue((web3Context: Web3ContextType) => {
    return getBalanceWithContract(SystemModuleType.EXCHANGE, null, web3Context);
  });

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
