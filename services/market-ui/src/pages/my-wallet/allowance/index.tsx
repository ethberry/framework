import { FC, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

import { AllowanceDialog, IAllowanceDto } from "./edit";
import { TokenType } from "@framework/types";

export const AllowanceButton: FC = () => {
  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const meta = useMetamask(async (values: IAllowanceDto, web3Context: Web3ContextType) => {
    const contract = new Contract(values.address, ERC20SimpleSol.abi, web3Context.provider?.getSigner());
    switch (values.tokenType) {
      case TokenType.ERC20:
        await contract.approve(process.env.EXCHANGE_ADDR, values.amount);
        await contract.approve(process.env.STAKING_ADDR, values.amount);
        break;
      case TokenType.ERC721:
      case TokenType.ERC998:
      case TokenType.ERC1155:
        await contract.setApprovalForAll(process.env.EXCHANGE_ADDR, true);
        await contract.setApprovalForAll(process.env.STAKING_ADDR, true);
        break;
      case TokenType.NATIVE:
      default:
        break;
    }
  });

  const handleAllowanceConfirm = async (values: IAllowanceDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsAllowanceDialogOpen(false);
    });
  };

  return (
    <>
      <Button onClick={handleAllowance}>
        <FormattedMessage id="pages.my-wallet.allowance" />
      </Button>
      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
      />
    </>
  );
};
