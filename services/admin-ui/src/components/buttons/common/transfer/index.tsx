import { FC, Fragment, useState } from "react";
import { Send } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { getEmptyToken } from "@ethberry/mui-inputs-asset";
import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";

import ERC1155SimpleSafeTransferFromABI from "@framework/abis/json/ERC1155Simple/safeTransferFrom.json";
import ERC721SimpleSafeTransferFromABI from "@framework/abis/json/ERC721Simple/safeTransferFrom.json";
import ERC20SimpleTransferABI from "@framework/abis/json/ERC20Simple/transfer.json";
// import ERC20SimpleTransferABI from "@framework/abis/json/ERC20Simple/transferAndCall.json";

import { shouldDisableByContractType } from "../../utils";
import { ITransferDto, TransferDialog } from "./dialog";

export interface ITransferButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const TransferButton: FC<ITransferButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures, contractType, id },
    disabled,
    variant,
  } = props;

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  const metaFn = useMetamask((values: ITransferDto, web3Context: Web3ContextType) => {
    const asset = values.token.components[0];
    if (asset.tokenType === TokenType.NATIVE) {
      return web3Context.provider?.getSigner().sendTransaction({
        to: values.address,
        value: asset.amount,
      }) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC20) {
      const contract = new Contract(address, ERC20SimpleTransferABI, web3Context.provider?.getSigner());
      return contract.transfer(values.address, asset.amount) as Promise<any>;
      // return contract["transferAndCall(address,uint256)"](values.address, asset.amount) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC721 || asset.tokenType === TokenType.ERC998) {
      const contract = new Contract(address, ERC721SimpleSafeTransferFromABI, web3Context.provider?.getSigner());
      return contract["safeTransferFrom(address,address,uint256)"](
        web3Context.account,
        values.address,
        asset.token.tokenId,
      ) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC1155) {
      const contract = new Contract(address, ERC1155SimpleSafeTransferFromABI, web3Context.provider?.getSigner());
      return contract.safeTransferFrom(
        web3Context.account,
        values.address,
        asset.token.tokenId,
        asset.amount,
        "0x",
      ) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleTransfer = () => {
    setIsTransferDialogOpen(true);
  };

  const handleTransferConfirm = async (values: ITransferDto) => {
    await metaFn(values);
    setIsTransferDialogOpen(false);
  };

  const handleTransferCancel = () => {
    setIsTransferDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleTransfer}
        icon={Send}
        message="form.buttons.transfer"
        className={className}
        dataTestId="TransferButton"
        disabled={
          disabled || shouldDisableByContractType(contract) || contractFeatures.includes(ContractFeatures.SOULBOUND)
        }
        variant={variant}
      />
      <TransferDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferDialogOpen}
        initialValues={{
          token: getEmptyToken(contractType!, id),
          address: "",
        }}
      />
    </Fragment>
  );
};
