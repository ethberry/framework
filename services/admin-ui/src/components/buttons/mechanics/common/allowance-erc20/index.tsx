import { FC, Fragment, useState } from "react";
import { HowToVote } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import approveERC20BlacklistABI from "@framework/abis/approve/ERC20Blacklist.json";

import { shouldDisableByContractType } from "../../../utils";
import { AllowanceERC20Dialog } from "./dialog";
import type { IAllowanceERC20Dto } from "./dialog";

export interface IAllowanceERC20ButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const AllowanceERC20Button: FC<IAllowanceERC20ButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address },
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

  const metaFn = useMetamask((values: IAllowanceERC20Dto, web3Context: Web3ContextType) => {
    const { amount, contract } = values;

    if (contract.contractType === TokenType.ERC20) {
      const contractErc20 = new Contract(contract.address, approveERC20BlacklistABI, web3Context.provider?.getSigner());
      return contractErc20.approve(address, amount) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleAllowanceConfirm = async (values: IAllowanceERC20Dto): Promise<void> => {
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
      <AllowanceERC20Dialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          amount: "0",
          contract: {
            address: "",
            contractType: TokenType.ERC20,
            decimals: 18,
          },
          contractId: 0,
        }}
      />
    </Fragment>
  );
};
