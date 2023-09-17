import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IBalance } from "@framework/types";
import { TokenType } from "@framework/types";

import VestingReleaseABI from "../../../../../abis/mechanics/vesting/release/release.abi.json";

export interface IVestingReleaseButtonProps {
  balance: IBalance;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const VestingReleaseButton: FC<IVestingReleaseButtonProps> = props => {
  const { balance, disabled, variant } = props;

  const metaRelease = useMetamask(async (vesting: IBalance, web3Context: Web3ContextType) => {
    const contract = new Contract(vesting.account, VestingReleaseABI, web3Context.provider?.getSigner());
    if (balance.token?.template?.contract?.contractType === TokenType.ERC20) {
      return contract["release(address)"](balance.token?.template.contract.address) as Promise<any>;
    } else if (balance.token?.template?.contract?.contractType === TokenType.NATIVE) {
      // https://ethereum.stackexchange.com/questions/132850/incorrect-gaslimit-estimation-for-transaction
      // const estGas = await contract["release()"].estimateGas();
      return contract["release()"]({
        // gasLimit: estGas.add(estGas.div(100).mul(10)),
      }) as Promise<void>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleClick = () => {
    return metaRelease(balance);
  };

  return (
    <ListAction
      onClick={handleClick}
      icon={Redeem}
      message="form.tips.release"
      dataTestId="VestingReleaseButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
