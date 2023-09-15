import { FC, Fragment, useState } from "react";
import { Send } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ContractFeatures, IContract, TokenType } from "@framework/types";

import ERC20TransferABI from "../../../../abis/hierarchy/erc20/transfer/erc20.transfer.abi.json";
import ERC721SafeTransferFromABI from "../../../../abis/hierarchy/erc721/transfer/erc721.safeTransferFrom.abi.json";
import ERC1155SafeTransferFromABI from "../../../../abis/hierarchy/erc1155/transfer/erc1155.safeTransferFrom.abi.json";

import { ListAction, ListActionVariant } from "../../../common/lists";
import { ITransferDto, TransferDialog } from "./dialog";

export interface ITransferMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const TransferMenuItem: FC<ITransferMenuItemProps> = props => {
  const {
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
      const contract = new Contract(address, ERC20TransferABI, web3Context.provider?.getSigner());
      return contract.transfer(values.address, asset.amount) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC721 || asset.tokenType === TokenType.ERC998) {
      const contract = new Contract(address, ERC721SafeTransferFromABI, web3Context.provider?.getSigner());
      return contract["safeTransferFrom(address,address,uint256)"](
        web3Context.account,
        values.address,
        asset.token.tokenId,
      ) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC1155) {
      const contract = new Contract(address, ERC1155SafeTransferFromABI, web3Context.provider?.getSigner());
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
        disabled={disabled || contractFeatures.includes(ContractFeatures.SOULBOUND)}
        icon={Send}
        message="form.buttons.transfer"
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
