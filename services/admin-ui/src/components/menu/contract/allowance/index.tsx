import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import ApproveERC20ABI from "./approve.erc20.abi.json";
import SetApprovalForAllERC721ABI from "./setApprovalForAll.erc721.abi.json";
import SetApprovalForAllERC1155ABI from "./setApprovalForAll.erc1155.abi.json";

import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IAllowanceMenuProps {
  contract: IContract;
}

export const AllowanceMenu: FC<IAllowanceMenuProps> = props => {
  const {
    contract: { address, contractType },
  } = props;

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAllowanceDto, web3Context: Web3ContextType) => {
    if (contractType === TokenType.ERC20) {
      const contractErc20 = new Contract(address, ApproveERC20ABI, web3Context.provider?.getSigner());
      return contractErc20.approve(values.address, values.amount) as Promise<any>;
    } else if (contractType === TokenType.ERC721 || contractType === TokenType.ERC998) {
      const contractErc721 = new Contract(address, SetApprovalForAllERC721ABI, web3Context.provider?.getSigner());
      return contractErc721.setApprovalForAll(values.address, true) as Promise<any>;
    } else if (contractType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(address, SetApprovalForAllERC1155ABI, web3Context.provider?.getSigner());
      return contractErc1155.setApprovalForAll(values.address, true) as Promise<any>;
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
      <MenuItem onClick={handleAllowance}>
        <ListItemIcon>
          <AddReactionIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.allowance" />
        </Typography>
      </MenuItem>
      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          address,
          amount: "0",
          decimals: 18,
        }}
      />
    </Fragment>
  );
};
