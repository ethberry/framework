import { FC, Fragment, useState } from "react";
import { HowToVote } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IPonziRule, TokenType } from "@framework/types";

import AllowanceABI from "../../../../../abis/mechanics/ponzi/allowance/allowance.abi.json";

import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IPonziAllowanceButtonProps {
  disabled?: boolean;
  rule: IPonziRule;
  variant?: ListActionVariant;
}

export const PonziAllowanceButton: FC<IPonziAllowanceButtonProps> = props => {
  const { disabled, rule, variant } = props;

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAllowanceDto, web3Context: Web3ContextType) => {
    if (rule.deposit?.components[0].tokenType === TokenType.ERC20) {
      const contractErc20 = new Contract(
        rule.deposit?.components[0].contract!.address,
        AllowanceABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc20.approve(rule.contract.address, values.amount) as Promise<any>;
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
        message="form.tips.allowance"
        dataTestId="PonziAllowanceButton"
        disabled={disabled}
        variant={variant}
      />
      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          amount: rule.deposit?.components[0].amount || "0",
          decimals: rule.deposit?.components[0].contract!.decimals || 18,
        }}
      />
    </Fragment>
  );
};
