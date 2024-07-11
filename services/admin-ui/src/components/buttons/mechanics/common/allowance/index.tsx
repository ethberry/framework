import { FC, Fragment, useState } from "react";
import { HowToVote } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import approveERC20BlacklistABI from "@framework/abis/json/ERC20Blacklist/approve.json";
import setApprovalForAllERC1155BlacklistABI from "@framework/abis/json/ERC1155Blacklist/setApprovalForAll.json";

import { shouldDisableByContractType } from "../../../utils";
import type { IAllowanceDto } from "./dialog";
import { AllowanceDialog } from "./dialog";

export interface IAllowanceButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
  disabledTokenTypes?: Array<TokenType>;
}

export const AllowanceButton: FC<IAllowanceButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address },
    disabled,
    variant,
    disabledTokenTypes,
  } = props;

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAllowanceDto, web3Context: Web3ContextType) => {
    const { amount, contract } = values;

    if (contract.contractType === TokenType.ERC20) {
      const contractErc20 = new Contract(contract.address, approveERC20BlacklistABI, web3Context.provider?.getSigner());
      return contractErc20.approve(address, amount) as Promise<any>;
    } else if (contract.contractType === TokenType.ERC721 || contract.contractType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        contract.address,
        setApprovalForAllERC1155BlacklistABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.setApprovalForAll(address, true) as Promise<any>;
    } else if (contract.contractType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        contract.address,
        setApprovalForAllERC1155BlacklistABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc1155.setApprovalForAll(address, true) as Promise<any>;
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
        disabled={disabled || shouldDisableByContractType(contract)}
        variant={variant}
      />
      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        disabledTokenTypes={disabledTokenTypes}
        initialValues={{
          tokenType: TokenType.ERC20,
          contractId: 0,
          amount: "0",
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
