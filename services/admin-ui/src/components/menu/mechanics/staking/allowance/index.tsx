import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC20ApproveABI from "../../../../../abis/extensions/allowance/erc20.approve.abi.json";
import ERC721SetApprovalForAllABI from "../../../../../abis/extensions/allowance/erc721.setApprovalForAll.abi.json";
import ERC1155SetApprovalForAllABI from "../../../../../abis/extensions/allowance/erc1155.setApprovalForAll.abi.json";

import { IStakingAllowanceDto, StakingAllowanceDialog } from "./dialog";

export interface IStakingAllowanceMenuProps {
  contract: IContract;
}

export const AllowanceMenu: FC<IStakingAllowanceMenuProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isStakingAllowanceDialogOpen, setIsStakingAllowanceDialogOpen] = useState(false);

  const handleStakingAllowance = (): void => {
    setIsStakingAllowanceDialogOpen(true);
  };

  const handleStakingAllowanceCancel = (): void => {
    setIsStakingAllowanceDialogOpen(false);
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
      throw new Error("unsupported token type");
    }
  });

  const handleStakingAllowanceConfirm = async (values: IStakingAllowanceDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsStakingAllowanceDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleStakingAllowance}>
        <ListItemIcon>
          <AddReactionIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.allowance" />
        </Typography>
      </MenuItem>

      <StakingAllowanceDialog
        onCancel={handleStakingAllowanceCancel}
        onConfirm={handleStakingAllowanceConfirm}
        open={isStakingAllowanceDialogOpen}
        initialValues={{
          amount: "0",
          contract: {
            address: "",
            contractType: TokenType.ERC20,
            tokenType: TokenType.ERC20,
            decimals: 18,
          },
          contractId: 0,
        }}
      />
    </Fragment>
  );
};
