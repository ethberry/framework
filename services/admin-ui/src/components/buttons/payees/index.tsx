import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { useMetamask } from "@gemunion/react-hooks-eth";

import { TokenType } from "@framework/types";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

export interface IWithdrawBalanceButtonProps {
  address: string; // balance.account = Exchange address
  contractType: TokenType; // releasable contract type
  contractAddress?: string; // releasable contract type
  payeeAddress?: string; // payee address
}

export const WithdrawBalanceButton: FC<IWithdrawBalanceButtonProps> = props => {
  const { address, contractType, payeeAddress } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    if (contractType === TokenType.ERC20) {
      const contract = new Contract(address, ExchangeSol.abi, web3Context.provider?.getSigner());
      return contract.release() as Promise<void>;
    } else {
      // TODO native check?
      const contract = new Contract(address, ExchangeSol.abi, web3Context.provider?.getSigner());
      return contract.release(payeeAddress) as Promise<void>;
    }
  });

  const handleRound = () => {
    return metaFn();
  };

  return (
    <Button startIcon={<Casino />} onClick={handleRound} data-testid="SystemBalanceWithdrawButton">
      <FormattedMessage id="pages.payees.withdraw" />
    </Button>
  );
};
