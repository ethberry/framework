import { FC, Fragment, useState } from "react";
import { Send } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";
import { ContractFeatures, TokenStatus } from "@framework/types";

import ERC20TransferFromABI from "@framework/abis/transfer/ERC20.json";
import { AccountDialog, IAccountDto } from "../../../../dialogs/account";

interface IErc20TransferButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const Erc20TransferButton: FC<IErc20TransferButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;

  const [isTransferTokenDialogOpen, setIsTransferTokenDialogOpen] = useState(false);

  const metaFn = useMetamask((dto: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      token.template!.contract!.address,
      ERC20TransferFromABI,
      web3Context.provider?.getSigner(),
    );
    return contract["transfer(address,uint256)"](dto.account, token.tokenId) as Promise<any>;
  });

  const handleTransfer = (): void => {
    setIsTransferTokenDialogOpen(true);
  };

  const handleTransferConfirm = async (dto: IAccountDto) => {
    await metaFn(dto).finally(() => {
      setIsTransferTokenDialogOpen(false);
    });
  };

  const handleTransferCancel = () => {
    setIsTransferTokenDialogOpen(false);
  };

  if (token.tokenStatus === TokenStatus.BURNED) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        icon={Send}
        onClick={handleTransfer}
        message="form.buttons.transfer"
        className={className}
        dataTestId="Erc20TransferButton"
        disabled={disabled || token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
        variant={variant}
      />
      <AccountDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferTokenDialogOpen}
        message="dialogs.transfer"
        testId="Erc20TransferDialogForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
