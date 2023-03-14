import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import ApproveERC20ABI from "./approve.erc20.abi.json";

import { IVestingAllowanceDto, VestingAllowanceDialog } from "./dialog";

export interface IVestingAllowanceMenuProps {
  contract: IContract;
}

export const VestingAllowanceMenu: FC<IVestingAllowanceMenuProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isVestingAllowanceDialogOpen, setIsVestingAllowanceDialogOpen] = useState(false);

  const handleVestingAllowance = (): void => {
    setIsVestingAllowanceDialogOpen(true);
  };

  const handleVestingAllowanceCancel = (): void => {
    setIsVestingAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IVestingAllowanceDto, web3Context: Web3ContextType) => {
    const asset = values.token.components[0];
    if (asset.tokenType === TokenType.ERC20) {
      const contract = new Contract(asset.contract.address, ApproveERC20ABI, web3Context.provider?.getSigner());
      return contract.approve(values.address, asset.amount) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleVestingAllowanceConfirm = async (values: IVestingAllowanceDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsVestingAllowanceDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleVestingAllowance}>
        <ListItemIcon>
          <AddReactionIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.allowance" />
        </Typography>
      </MenuItem>
      <VestingAllowanceDialog
        onCancel={handleVestingAllowanceCancel}
        onConfirm={handleVestingAllowanceConfirm}
        open={isVestingAllowanceDialogOpen}
        initialValues={{
          token: getEmptyToken(),
          address,
        }}
      />
    </Fragment>
  );
};
