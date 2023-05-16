import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useIntl } from "react-intl";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IBalance } from "@framework/types";
import { TokenType } from "@framework/types";

import ExchangeReleaseABI from "../../../../abis/components/buttons/exchange/release/release.abi.json";

export interface IExchangeReleaseButtonProps {
  balance: IBalance;
}

export const ExchangeReleaseButton: FC<IExchangeReleaseButtonProps> = props => {
  const { balance } = props;

  const { formatMessage } = useIntl();

  const metaRelease = useMetamask(async (balance: IBalance, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeReleaseABI, web3Context.provider?.getSigner());
    if (balance.token?.template?.contract?.contractType === TokenType.ERC20) {
      return contract["release(address,address)"](
        balance.token?.template.contract.address,
        web3Context.account,
      ) as Promise<any>;
    } else if (balance.token?.template?.contract?.contractType === TokenType.NATIVE) {
      return contract["release(address)"](web3Context.account) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleClick = () => {
    return metaRelease(balance);
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.release" })}>
      <IconButton onClick={handleClick} data-testid="ExchangeReleaseButton">
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
