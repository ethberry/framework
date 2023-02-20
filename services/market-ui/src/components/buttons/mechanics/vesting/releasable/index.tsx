import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useIntl } from "react-intl";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import type { IBalance } from "@framework/types";
import { TokenType } from "@framework/types";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Exchange/Exchange.sol/Exchange.json";

import { formatEther } from "../../../../../utils/money";

export interface IVestingReleasableButtonProps {
  balance: IBalance;
}

export const VestingReleasableButton: FC<IVestingReleasableButtonProps> = props => {
  const { balance } = props;

  const { formatMessage } = useIntl();

  const metaReleasable = useMetamaskValue(
    async (balance: IBalance, web3Context: Web3ContextType) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
      if (balance.token?.template?.contract?.contractType === TokenType.ERC20) {
        return contract["releasable(address)"](balance.token.template.contract.address) as Promise<any>;
      } else if (balance.token?.template?.contract?.contractType === TokenType.NATIVE) {
        return contract["releasable()"]() as Promise<any>;
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
      <IconButton onClick={handleClick} data-testid="VestingReleasableButton">
        <Visibility />
      </IconButton>
    </Tooltip>
  );
};
