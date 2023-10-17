import { FC, Fragment, useState } from "react";
import { Send } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IToken } from "@framework/types";
import { ContractFeatures, TokenStatus } from "@framework/types";

import ERC721SafeTransferFromABI from "../../../../../abis/hierarchy/erc721/transfer/safeTransferFrom.abi.json";

import { AccountDialog, IAccountDto } from "../../../../dialogs/account";

interface IErc721TransferButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const Erc721TransferButton: FC<IErc721TransferButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;

  const [isTransferTokenDialogOpen, setIsTransferTokenDialogOpen] = useState(false);

  const metaFn = useMetamask((dto: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      token.template!.contract!.address,
      ERC721SafeTransferFromABI,
      web3Context.provider?.getSigner(),
    );
    return contract["safeTransferFrom(address,address,uint256)"](
      web3Context.account,
      dto.account,
      token.tokenId,
    ) as Promise<any>;
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
        dataTestId="Erc721TransferButton"
        disabled={disabled || token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
        variant={variant}
      />
      <AccountDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferTokenDialogOpen}
        message="dialogs.transfer"
        testId="Erc721TransferDialogForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
