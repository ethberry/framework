import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";

import { IconButton, Tooltip } from "@mui/material";
import { HowToVote } from "@mui/icons-material";

import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IPyramidRule, IStakingRule, TokenType } from "@framework/types";

import AllowanceERC20ABI from "./allowance.erc20.abi.json";

import { DepositAllowanceDialog, IAllowanceDto } from "../../dialogs/deposit-allowance";

export interface IStakingDepositAllowanceButtonProps {
  rule: IStakingRule | IPyramidRule;
}

export const StakingDepositAllowanceButton: FC<IStakingDepositAllowanceButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

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
        AllowanceERC20ABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc20.approve(process.env.STAKING_ADDR, values.amount) as Promise<any>;
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
      <Tooltip title={formatMessage({ id: "form.tips.allowance" })}>
        <IconButton onClick={handleAllowance} data-testid="StakeDepositAllowanceButton">
          <HowToVote />
        </IconButton>
      </Tooltip>
      <DepositAllowanceDialog
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
