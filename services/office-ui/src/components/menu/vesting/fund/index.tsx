import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import TransferERC20ABI from "./transfer.erc20.abi.json";

import { IVestingFundDto, VestingFundDialog } from "./dialog";

export interface IFundMenuItemProps {
  vesting: IContract;
}

export const FundMenuItem: FC<IFundMenuItemProps> = props => {
  const { vesting } = props;

  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);

  const metaFn = useMetamask((values: IVestingFundDto, web3Context: Web3ContextType) => {
    if (values.tokenType === TokenType.NATIVE) {
      return web3Context.provider?.getSigner().sendTransaction({
        to: vesting.address,
        value: values.amount,
      }) as Promise<any>;
    } else if (values.tokenType === TokenType.ERC20) {
      const contract = new Contract(values.contract.address, TransferERC20ABI, web3Context.provider?.getSigner());
      return contract.transfer(vesting.address, values.amount) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleFund = () => {
    setIsFundDialogOpen(true);
  };

  const handleFundConfirm = async (values: IVestingFundDto) => {
    await metaFn(values);
    setIsFundDialogOpen(false);
  };

  const handleFundCancel = () => {
    setIsFundDialogOpen(false);
  };

  return (
    <Fragment>
      <MenuItem onClick={handleFund}>
        <ListItemIcon>
          <AddCircleOutlineIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.fund" />
        </Typography>
      </MenuItem>
      <VestingFundDialog
        onConfirm={handleFundConfirm}
        onCancel={handleFundCancel}
        open={isFundDialogOpen}
        initialValues={{
          tokenType: TokenType.NATIVE,
          amount: "0",
          contract: {
            address: "",
            decimals: 0,
          },
          contractId: 0,
        }}
      />
    </Fragment>
  );
};
