import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import ERC1155SafeTransferFromABI from "../../../../../abis/hierarchy/erc1155/transfer/transfer.abi.json";

import type { IErc1155TransferDto } from "./dialog";
import { Erc1155TransferDialog } from "./dialog";

interface ITokenTransferButtonProps {
  className?: string;
  token: IToken;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const Erc1155TransferButton: FC<ITokenTransferButtonProps> = props => {
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

  return (
    <Fragment>
      <ListAction
        onClick={handleTransfer}
        message="form.buttons.transfer"
        className={className}
        dataTestId="TransferErc1155Button"
        disabled={disabled || token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
        variant={variant}
      />
      <Erc1155TransferDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferTokenDialogOpen}
        message="dialogs.transfer"
        testId="TransferErc1155DialogForm"
        initialValues={{
          account: "",
          amount: "1",
        }}
      />
    </Fragment>
  );
};
