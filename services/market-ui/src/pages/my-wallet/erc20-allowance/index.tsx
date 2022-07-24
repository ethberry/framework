import { FC, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

import { Erc20AllowanceDialog, IErc20AllowanceDto } from "./edit";

export const Erc20AllowanceButton: FC = () => {
  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const meta = useMetamask((values: IErc20AllowanceDto, web3Context: Web3ContextType) => {
    const contract = new Contract(values.address, ERC20SimpleSol.abi, web3Context.provider?.getSigner());
    return contract.approve(process.env.EXCHANGE_ADDR, values.amount) as Promise<void>;
  });

  const handleAllowanceConfirm = async (values: IErc20AllowanceDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsAllowanceDialogOpen(false);
    });
  };

  return (
    <>
      <Button onClick={handleAllowance}>
        <FormattedMessage id="pages.my-wallet.allowance" />
      </Button>
      <Erc20AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
      />
    </>
  );
};
