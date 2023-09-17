import { FC } from "react";
import { Visibility } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IBalance } from "@framework/types";
import { TokenType } from "@framework/types";

import VestingReleasableABI from "../../../../../abis/mechanics/vesting/releasable/releasable.abi.json";

import { formatEther } from "../../../../../utils/money";

export interface IVestingReleasableButtonProps {
  balance: IBalance;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const VestingReleasableButton: FC<IVestingReleasableButtonProps> = props => {
  const { balance, disabled, variant } = props;

  const metaReleasable = useMetamaskValue(
    async (balance: IBalance, web3Context: Web3ContextType) => {
      const contract = new Contract(balance.account, VestingReleasableABI, web3Context.provider?.getSigner());
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
      `Releasable: ${formatEther(
        amount.toString(),
        balance.token?.template?.contract?.decimals,
        balance.token?.template?.contract?.symbol,
      )}`,
    );
  };

  return (
    <ListAction
      onClick={handleClick}
      icon={Visibility}
      message="form.tips.releasable"
      dataTestId="VestingReleasableButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
