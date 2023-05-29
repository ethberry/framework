import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useIntl } from "react-intl";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import type { IBalance } from "@framework/types";
import { TokenType } from "@framework/types";

import ExchangeWithdrawABI from "../../../../abis/components/buttons/exchange/withdraw/withdraw.abi.json";

export interface IExchangeWithdrawButtonProps {
  balance: IBalance;
}

export const ExchangeWithdrawButton: FC<IExchangeWithdrawButtonProps> = props => {
  const { balance } = props;

  const { formatMessage } = useIntl();

  const metaReleasable = useMetamaskValue(
    async (balance: IBalance, web3Context: Web3ContextType) => {
      const contract = new Contract(balance.account, ExchangeWithdrawABI, web3Context.provider?.getSigner());
      if (
        balance.token?.template?.contract?.contractType === TokenType.NATIVE ||
        balance.token?.template?.contract?.contractType === TokenType.ERC20
      ) {
        return contract.withdraw({
          components: [
            {
              tokenType: Object.values(TokenType).indexOf(balance.token?.template?.contract?.contractType),
              token: balance.token?.template?.contract?.address,
              tokenId: balance.token?.tokenId,
              amount: balance.amount,
            },
          ],
        }) as Promise<any>;
      } else {
        throw new Error("unsupported token type");
      }
    },
    { success: false },
  );

  const handleClick = async () => {
    await metaReleasable(balance);
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.withdraw" })}>
      <IconButton onClick={handleClick} data-testid="ExchangeWithdrawButton">
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
