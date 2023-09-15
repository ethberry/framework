import { FC, Fragment, useState } from "react";
import { AddReaction } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";

import ERC20ApproveABI from "../../../../../abis/extensions/allowance/erc20.approve.abi.json";
import ERC721SetApprovalForAllABI from "../../../../../abis/extensions/allowance/erc721.setApprovalForAll.abi.json";
import ERC1155SetApprovalForAllABI from "../../../../../abis/extensions/allowance/erc1155.setApprovalForAll.abi.json";

import { ListActionVariant } from "../../../../common/lists/interface";
import { StyledListAction } from "../../../../common/lists/list-action";
import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IAllowanceMenuItemProps {
  contract: IContract;
  variant?: ListActionVariant;
}

export const AllowanceMenuItem: FC<IAllowanceMenuItemProps> = props => {
  const {
    contract: { address, contractFeatures, contractType, decimals },
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
      <StyledListAction
        onClick={handleAllowance}
        disabled={contractFeatures.includes(ContractFeatures.SOULBOUND)}
        icon={AddReaction}
        message="form.buttons.allowance"
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
