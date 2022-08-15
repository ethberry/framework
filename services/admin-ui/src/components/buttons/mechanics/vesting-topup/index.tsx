import { FC, Fragment, useState } from "react";
import { IconButton } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IVesting, TokenType } from "@framework/types";
import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

import { IVestingTopUpDto, VestingTopUpDialog } from "./topup-dialog";

export interface IVestingButtonProps {
  vesting: IVesting;
}

export const VestingTopUpButton: FC<IVestingButtonProps> = props => {
  const { vesting } = props;

  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);

  const metaFn = useMetamask((values: IVestingTopUpDto, web3Context: Web3ContextType) => {
    if (values.tokenType === TokenType.NATIVE) {
      return web3Context.provider?.getSigner().sendTransaction({
        to: vesting.address,
        value: values.amount,
      }) as Promise<any>;
    } else if (values.tokenType === TokenType.ERC20) {
      const contract = new Contract(values.address, ERC20SimpleSol.abi, web3Context.provider?.getSigner());
      return contract.transfer(vesting.address, values.amount) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleTopUp = () => {
    setIsTopUpDialogOpen(true);
  };

  const onTopUpConfirm = async (values: IVestingTopUpDto) => {
    await metaFn(values);
    setIsTopUpDialogOpen(false);
  };

  const handleTopUpCancel = () => {
    setIsTopUpDialogOpen(false);
  };

  return (
    <Fragment>
      <IconButton onClick={handleTopUp}>
        <Savings />
      </IconButton>
      <VestingTopUpDialog onConfirm={onTopUpConfirm} onCancel={handleTopUpCancel} open={isTopUpDialogOpen} />
    </Fragment>
  );
};
