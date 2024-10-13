import { FC, Fragment, useState } from "react";
import { AddReaction } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";
import { useMetamask } from "@ethberry/react-hooks-eth";

import ERC20ApproveABI from "@framework/abis/json/ERC20Simple/approve.json";
import ERC721ERC998ERC1155SetApprovalForAllABI from "@framework/abis/json/ERC1155Simple/setApprovalForAll.json";

import type { IStakingAllowanceDto } from "./dialog";
import { StakingAllowanceDialog } from "./dialog";

export interface IStakingAllowanceButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const StakingAllowanceButton: FC<IStakingAllowanceButtonProps> = props => {
  const {
    className,
    contract: { address },
    disabled,
    variant,
  } = props;

  const [isStakingAllowanceDialogOpen, setIsStakingAllowanceDialogOpen] = useState(false);

  const handleStakingAllowance = (): void => {
    setIsStakingAllowanceDialogOpen(true);
  };

  const handleStakingAllowanceCancel = (): void => {
    setIsStakingAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IStakingAllowanceDto, web3Context: Web3ContextType) => {
    const { amount, contract } = values;

    if (contract.contractType === TokenType.ERC20) {
      const contractErc20 = new Contract(contract.address, ERC20ApproveABI, web3Context.provider?.getSigner());
      return contractErc20.approve(address, amount) as Promise<any>;
    } else if (contract.contractType === TokenType.ERC721 || contract.contractType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        contract.address,
        ERC721ERC998ERC1155SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.setApprovalForAll(address, true) as Promise<any>;
    } else if (contract.contractType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        contract.address,
        ERC721ERC998ERC1155SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc1155.setApprovalForAll(address, true) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleStakingAllowanceConfirm = async (values: IStakingAllowanceDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsStakingAllowanceDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleStakingAllowance}
        icon={AddReaction}
        message="form.buttons.allowance"
        className={className}
        dataTestId="StakingAllowanceButton"
        disabled={disabled}
        variant={variant}
      />
      <StakingAllowanceDialog
        onCancel={handleStakingAllowanceCancel}
        onConfirm={handleStakingAllowanceConfirm}
        open={isStakingAllowanceDialogOpen}
        initialValues={{
          tokenType: TokenType.ERC20,
          contractId: 0,
          amount: 0n,
          contract: {
            address: "",
            contractType: TokenType.ERC20,
            decimals: 18,
          },
        }}
      />
    </Fragment>
  );
};
