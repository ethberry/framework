import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ContractFeatures, IContract, TokenType } from "@framework/types";

import ERC20TransferABI from "../../../../abis/components/menu/common/transfer/erc20.transfer.abi.json";
import ERC721SafeTransferFromABI from "../../../../abis/components/menu/common/transfer/erc721.safeTransferFrom.abi.json";
import ERC1155SafeTransferFromABI from "../../../../abis/components/menu/common/transfer/erc1155.safeTransferFrom.abi.json";

import { ITransferDto, TransferDialog } from "./dialog";

export interface ITransferMenuItemProps {
  contract: IContract;
}

export const TransferMenuItem: FC<ITransferMenuItemProps> = props => {
  const {
    contract: { address, contractFeatures, contractType, id },
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
      return contract.transfer(web3Context.account, values.address, asset.amount) as Promise<any>;
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
      <MenuItem onClick={handleTransfer} disabled={contractFeatures.includes(ContractFeatures.SOULBOUND)}>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.transfer" />
        </Typography>
      </MenuItem>
      <TransferDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferDialogOpen}
        initialValues={{
          token: getEmptyToken(contractType, id),
          address: "",
        }}
      />
    </Fragment>
  );
};
