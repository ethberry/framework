import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import ERC20ApproveABI from "../../../../../abis/components/common/allowance/erc20.approve.abi.json";
import ERC721SetApprovalForAllABI from "../../../../../abis/components/common/allowance/erc721.setApprovalForAll.abi.json";

import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IAllowanceMenuItemProps {
  contract: IContract;
}

export const AllowanceMenuItem: FC<IAllowanceMenuItemProps> = props => {
  const {
    contract: { address, contractType, decimals },
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
      const contractErc20 = new Contract(address, ERC20ApproveABI, web3Context.provider?.getSigner());
      return contractErc20.approve(values.address, values.amount) as Promise<any>;
    } else if (
      contractType === TokenType.ERC721 ||
      contractType === TokenType.ERC998 ||
      contractType === TokenType.ERC1155
    ) {
      const contractErc721 = new Contract(address, ERC721SetApprovalForAllABI, web3Context.provider?.getSigner());
      return contractErc721.setApprovalForAll(values.address, true) as Promise<any>;
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
          contractType,
          decimals,
        }}
      />
    </Fragment>
  );
};
