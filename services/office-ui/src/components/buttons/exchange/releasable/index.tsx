import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useIntl } from "react-intl";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import type { IBalance } from "@framework/types";
import { TokenType } from "@framework/types";

import ReleasableABI from "./releasable.abi.json";

import { formatEther } from "../../../../utils/money";

export interface IExchangeReleasableButtonProps {
  balance: IBalance;
}

export const ExchangeReleasableButton: FC<IExchangeReleasableButtonProps> = props => {
  const { balance } = props;

  const { formatMessage } = useIntl();

  const metaReleasable = useMetamaskValue(
    async (balance: IBalance, web3Context: Web3ContextType) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, ReleasableABI, web3Context.provider?.getSigner());
      if (balance.token?.template?.contract?.contractType === TokenType.ERC20) {
        return contract["releasable(address,address)"](
          balance.token.template.contract.address,
          web3Context.account,
        ) as Promise<any>;
      } else if (balance.token?.template?.contract?.contractType === TokenType.NATIVE) {
        return contract["releasable(address)"](web3Context.account) as Promise<any>;
      } else {
        throw new Error("unsupported token type");
      }
    },
    { success: false },
  );

  const handleClick = async () => {
    const amount = await metaReleasable(balance);
    alert(
      formatEther(
        amount.toString(),
        balance.token?.template?.contract?.decimals,
        balance.token?.template?.contract?.symbol,
      ),
    );
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.releasable" })}>
      <IconButton onClick={handleClick} data-testid="ExchangeReleasableButton">
        <Visibility />
      </IconButton>
    </Tooltip>
  );
};
