import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";

import { IconButton, Tooltip } from "@mui/material";
import { HowToVote } from "@mui/icons-material";

import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IStakingRule, TokenType } from "@framework/types";

import ERC20ApproveABI from "../../../../../abis/common/allowance/erc20.approve.abi.json";
import ERC721SetApprovalForAllABI from "../../../../../abis/common/allowance/erc721.setApprovalForAll.abi.json";
import ERC1155SetApprovalForAllABI from "../../../../../abis/common/allowance/erc1155.setApprovalForAll.abi.json";

import { IStakingAllowanceDto, StakingAllowanceDialog } from "./dialog";

export interface IStakingAllowanceButtonProps {
  rule: IStakingRule;
}

export const StakingAllowanceButton: FC<IStakingAllowanceButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  // TODO deposit allowance array
  const metaFn = useMetamask((values: IStakingAllowanceDto, web3Context: Web3ContextType) => {
    const { amount, contract } = values;
    const tokenType = rule.deposit?.components[0].tokenType;
    const address = rule.deposit?.components[0].contract!.address;

    if (tokenType === TokenType.ERC20) {
      const contractErc20 = new Contract(contract.address, ERC20ApproveABI, web3Context.provider?.getSigner());
      return contractErc20.approve(address, amount) as Promise<any>;
    } else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        contract.address,
        ERC721SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.setApprovalForAll(address, true) as Promise<any>;
    } else if (tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        contract.address,
        ERC1155SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc1155.setApprovalForAll(address, true) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleAllowanceConfirm = async (values: IStakingAllowanceDto): Promise<void> => {
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
      <StakingAllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          amount: rule.deposit?.components[0].amount || "0",
          contract: {
            address: "",
            contractType: TokenType.ERC20,
            tokenType: TokenType.ERC20,
            decimals: rule.deposit?.components[0].contract!.decimals ?? 18,
          },
          contractId: 0,
        }}
      />
    </Fragment>
  );
};
