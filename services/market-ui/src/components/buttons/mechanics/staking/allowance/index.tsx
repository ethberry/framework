import { FC, Fragment, useState } from "react";
import { HowToVote } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IStakingRule } from "@framework/types";
import { TokenType } from "@framework/types";

import ERC20ApproveABI from "../../../../../abis/extensions/allowance/erc20.approve.abi.json";
import ERC721SetApprovalForAllABI from "../../../../../abis/extensions/allowance/erc721.setApprovalForAll.abi.json";
import ERC1155SetApprovalForAllABI from "../../../../../abis/extensions/allowance/erc1155.setApprovalForAll.abi.json";

import { AllowanceButton } from "../../../../../pages/exchange/wallet/allowance";
import { StakingAllowanceDialog } from "./dialog";
import type { IStakingAllowanceDto } from "./dialog";

export interface IStakingAllowanceButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}
// TODO allowance for deposit array
// TODO allowance for exact 721 or 998 token
export const StakingAllowanceButton: FC<IStakingAllowanceButtonProps> = props => {
  const { className, disabled, rule, variant } = props;
  const { address } = rule.contract!;

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const isNft = rule.deposit?.components.every(
    component =>
      component.contract!.contractType === TokenType.ERC721 || component.contract!.contractType === TokenType.ERC998,
  );

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IStakingAllowanceDto, web3Context: Web3ContextType) => {
    const { amount, contract } = values;

    if (contract.contractType === TokenType.ERC20) {
      const contractErc20 = new Contract(contract.address, ERC20ApproveABI, web3Context.provider?.getSigner());
      return contractErc20.approve(address, amount) as Promise<any>;
    } else if (contract.contractType === TokenType.ERC721 || contract.contractType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        contract.address,
        ERC721SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.setApprovalForAll(address, true) as Promise<any>;
    } else if (contract.contractType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        contract.address,
        ERC1155SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc1155.setApprovalForAll(address, true) as Promise<any>;
    } else {
      alert("NATIVE token!");
      return Promise.resolve(undefined);
      // throw new Error("unsupported token type");
    }
  });

  const handleAllowanceConfirm = async (values: IStakingAllowanceDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsAllowanceDialogOpen(false);
    });
  };

  const isDisabled = rule.deposit?.components.every(component => component.contract!.contractType === TokenType.NATIVE);

  const tokenTo = {
    components: [
      {
        amount: "1",
        contractId: rule.deposit!.components[0].contractId,
        templateId: rule.deposit!.components[0].templateId,
        tokenType: rule.deposit!.components[0].tokenType,
        contract: {
          address: rule.deposit!.components[0].contract!.address,
          decimals: rule.deposit!.components[0].contract!.decimals,
        },
      },
    ],
  };

  return isNft ? (
    <AllowanceButton isSmall={true} token={tokenTo} contract={rule.contract} />
  ) : (
    <Fragment>
      <ListAction
        onClick={handleAllowance}
        icon={HowToVote}
        message="form.tips.allowance"
        className={className}
        dataTestId="StakeDepositAllowanceButton"
        disabled={isDisabled || disabled}
        variant={variant}
      />
      <StakingAllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          tokenType: rule.deposit!.components[0].contract!.contractType || TokenType.ERC20,
          contractId: rule.deposit!.components[0].contract!.id,
          amount: rule.deposit?.components[0].amount || "0",
          contract: {
            address: rule.deposit!.components[0].contract!.address || "",
            contractType: rule.deposit!.components[0].contract!.contractType || TokenType.ERC20,
            decimals: rule.deposit!.components[0].contract!.decimals || 18,
          },
        }}
      />
    </Fragment>
  );
};
