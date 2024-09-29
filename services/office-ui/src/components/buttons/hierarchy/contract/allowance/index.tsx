import { FC, Fragment, useState } from "react";
import { HowToVote } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";

import ERC20SimpleApproveABI from "@framework/abis/json/ERC20Simple/approve.json";
import ERC721SimpleSetApprovalForAllABI from "@framework/abis/json/ERC721Simple/setApprovalForAll.json";
import ERC1155SimpleSetApprovalForAllABI from "@framework/abis/json/ERC1155Simple/setApprovalForAll.json";

import { shouldDisableByContractType } from "../../../utils";
import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IContractAllowanceButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ContractAllowanceButton: FC<IContractAllowanceButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures, contractType, decimals },
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
      const contractErc20 = new Contract(address, ERC20SimpleApproveABI, web3Context.provider?.getSigner());
      return contractErc20.approve(values.address, values.amount) as Promise<any>;
    } else if (contractType === TokenType.ERC721 || contractType === TokenType.ERC998) {
      const contractErc721 = new Contract(address, ERC721SimpleSetApprovalForAllABI, web3Context.provider?.getSigner());
      return contractErc721.setApprovalForAll(values.address, true) as Promise<any>;
    } else if (contractType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        address,
        ERC1155SimpleSetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
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
        disabled={
          disabled || shouldDisableByContractType(contract) || contractFeatures.includes(ContractFeatures.SOULBOUND)
        }
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
