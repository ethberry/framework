import { FC, useEffect, useState } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract } from "ethers";

import { useMetamask, useMetamaskValue } from "@gemunion/react-hooks-eth";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Exchange/Exchange.sol/Exchange.json";

export const ReferralRewardButton: FC = () => {
  const [balance, setBalance] = useState("");
  const { isActive, account } = useWeb3React();

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
    return contract.withdraw() as Promise<void>;
  });

  const handleWithdraw = () => {
    return metaFn();
  };

  // TODO add token selector for balance and get balances on demand only
  const getBalance = useMetamaskValue(
    (web3Context: Web3ContextType) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
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
    <Button onClick={handleWithdraw} disabled={balance === "0"}>
      <FormattedMessage id="form.buttons.withdraw" /> {constants.EtherSymbol}
      {balance}
    </Button>
  );
};
