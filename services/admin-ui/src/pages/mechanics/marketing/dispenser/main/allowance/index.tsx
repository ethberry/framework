import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { HowToVote } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask, useSystemContract } from "@ethberry/react-hooks-eth";
import type { IContract } from "@framework/types";
import { SystemModuleType, TokenType } from "@framework/types";

import ERC20SimpleApproveABI from "@framework/abis/json/ERC20Simple/approve.json";
import ERC1155SimpleSetApprovalForAllABI from "@framework/abis/json/ERC1155Simple/setApprovalForAll.json";

import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IAllowanceButtonProps {
  className?: string;
}

export const AllowanceButton: FC<IAllowanceButtonProps> = props => {
  const { className } = props;

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (values: IAllowanceDto, web3Context: Web3ContextType, systemContract: IContract) => {
      const { amount, contract } = values;
      if (contract.contractType === TokenType.ERC20) {
        const contractErc20 = new Contract(contract.address, ERC20SimpleApproveABI, web3Context.provider?.getSigner());
        return contractErc20.approve(systemContract.address, amount) as Promise<void>;
      } else if (contract.contractType === TokenType.ERC721 || contract.contractType === TokenType.ERC998) {
        const contractErc721 = new Contract(
          contract.address,
          ERC1155SimpleSetApprovalForAllABI,
          web3Context.provider?.getSigner(),
        );
        return contractErc721.setApprovalForAll(systemContract.address, true) as Promise<void>;
      } else if (contract.contractType === TokenType.ERC1155) {
        const contractErc1155 = new Contract(
          contract.address,
          ERC1155SimpleSetApprovalForAllABI,
          web3Context.provider?.getSigner(),
        );
        return contractErc1155.setApprovalForAll(systemContract.address, true) as Promise<void>;
      } else {
        throw new Error("unsupported token type");
      }
    },
  );

  const metaFn = useMetamask((values: IAllowanceDto, web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.DISPENSER, values, web3Context);
  });

  const handleAllowanceConfirm = async (values: IAllowanceDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsAllowanceDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<HowToVote />}
        onClick={handleAllowance}
        className={className}
        data-testid="AllowanceButton"
      >
        <FormattedMessage id="form.buttons.allowance" />
      </Button>
      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          tokenType: TokenType.ERC20,
          contract: {
            address: "",
            contractType: TokenType.ERC20,
            decimals: 18,
          },
          contractId: 0,
          amount: 0n,
        }}
      />
    </Fragment>
  );
};
