import { FC, Fragment, useState } from "react";
import { Send } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";
import { ContractFeatures, TokenStatus } from "@framework/types";

import ERC1155SafeTransferFromABI from "@framework/abis/safeTransferFrom/ERC1155Blacklist.json";

import type { IErc1155TransferDto } from "./dialog";
import { Erc1155TransferDialog } from "./dialog";

interface IErc1155TransferButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const Erc1155TransferButton: FC<IErc1155TransferButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;

  const [isTransferTokenDialogOpen, setIsTransferTokenDialogOpen] = useState(false);

  const metaFn = useMetamask((dto: IErc1155TransferDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      token.template!.contract!.address,
      ERC1155SafeTransferFromABI,
      web3Context.provider?.getSigner(),
    );
    return contract.safeTransferFrom(web3Context.account, dto.account, token.tokenId, dto.amount, "0x") as Promise<any>;
  });

  const handleTransfer = (): void => {
    setIsTransferTokenDialogOpen(true);
  };

  const handleTransferConfirm = async (dto: IErc1155TransferDto) => {
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
        dataTestId="Erc721TransferButton"
        disabled={disabled || token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
        variant={variant}
      />
      <Erc1155TransferDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferTokenDialogOpen}
        message="dialogs.transfer"
        testId="Erc721TransferDialogForm"
        initialValues={{
          account: "",
          amount: "1",
        }}
      />
    </Fragment>
  );
};
