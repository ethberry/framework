import { FC, Fragment, useState } from "react";
import { HowToVote } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import ERC20ApproveABI from "../../../../../abis/extensions/allowance/erc20.approve.abi.json";
import ERC721SetApprovalForAllABI from "../../../../../abis/extensions/allowance/erc721.setApprovalForAll.abi.json";
import ERC1155SetApprovalForAllABI from "../../../../../abis/extensions/allowance/erc1155.setApprovalForAll.abi.json";

import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IAllowanceButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const AllowanceButton: FC<IAllowanceButtonProps> = props => {
  const {
    className,
    contract: { address, contractType, decimals },
    disabled,
    variant,
  } = props;

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAllowanceDto, web3Context: Web3ContextType) => {
    if (contractType === TokenType.ERC20) {
      const contractErc20 = new Contract(address, ERC20ApproveABI, web3Context.provider?.getSigner());
      return contractErc20.approve(values.address, values.amount) as Promise<any>;
    } else if (contractType === TokenType.ERC721 || contractType === TokenType.ERC998) {
      const contractErc721 = new Contract(address, ERC721SetApprovalForAllABI, web3Context.provider?.getSigner());
      return contractErc721.setApprovalForAll(values.address, true) as Promise<any>;
    } else if (contractType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(address, ERC1155SetApprovalForAllABI, web3Context.provider?.getSigner());
      return contractErc1155.setApprovalForAll(values.address, true) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleAllowanceConfirm = async (values: IAllowanceDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsAllowanceDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleAllowance}
        icon={HowToVote}
        message="form.buttons.allowance"
        className={className}
        dataTestId="AllowanceButton"
        disabled={disabled}
        variant={variant}
      />
      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          address,
          amount: "0",
          contractType,
          decimals,
        }}
      />
    </Fragment>
  );
};