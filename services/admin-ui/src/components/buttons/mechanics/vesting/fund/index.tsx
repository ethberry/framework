import { FC, Fragment, useState } from "react";
import { IconButton } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IVesting, TokenType } from "@framework/types";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

import { IVestingFundDto, VestingFundDialog } from "./dialog";

export interface IVestingButtonProps {
  vesting: IVesting;
}

export const VestingFundButton: FC<IVestingButtonProps> = props => {
  const { vesting } = props;

  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);

  const metaFn = useMetamask((values: IVestingFundDto, web3Context: Web3ContextType) => {
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

  const handleFund = () => {
    setIsFundDialogOpen(true);
  };

  const handleFundConfirm = async (values: IVestingFundDto) => {
    await metaFn(values);
    setIsFundDialogOpen(false);
  };

  const handleFundCancel = () => {
    setIsFundDialogOpen(false);
  };

  return (
    <Fragment>
      <IconButton onClick={handleFund} data-testid="VestingFundButton">
        <Savings />
      </IconButton>
      <VestingFundDialog
        onConfirm={handleFundConfirm}
        onCancel={handleFundCancel}
        open={isFundDialogOpen}
        initialValues={{
          tokenType: TokenType.NATIVE,
          amount: "0",
          address: "",
          contractId: 0,
          decimals: 0,
        }}
      />
    </Fragment>
  );
};
