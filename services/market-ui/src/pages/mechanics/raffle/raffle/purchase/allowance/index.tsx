import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { HowToVote } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IContract, TokenType } from "@framework/types";

import ERC20ApproveABI from "../../../../../../abis/extensions/allowance/erc20.approve.abi.json";

import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IAllowanceButtonProps {
  contract: IContract;
  className?: string;
}

export const AllowanceButton: FC<IAllowanceButtonProps> = props => {
  const {
    className,
    contract: { address },
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
      const contractErc20 = new Contract(contract.address, ERC20ApproveABI, web3Context.provider?.getSigner());
      return contractErc20.approve(address, amount) as Promise<any>;
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
          amount: "0",
        }}
      />
    </Fragment>
  );
};
