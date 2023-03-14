import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { BigNumber, constants, Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import TopUpABI from "./topUp.abi.json";

import { IVestingFundDto, VestingFundDialog } from "./dialog";

export interface IMintMenuItemProps {
  contract: IContract;
}

export const FundMenuItem: FC<IMintMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);

  const metaFn = useMetamask((values: IVestingFundDto, web3Context: Web3ContextType) => {
    const asset = values.token.components[0];
    const contract = new Contract(address, TopUpABI, web3Context.provider?.getSigner());
    if (asset.tokenType === TokenType.NATIVE) {
      return contract.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId: 0,
            amount: asset.amount,
          },
        ],
        { value: BigNumber.from(asset.amount) },
      ) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC20) {
      // const contract = new Contract(address, VestingSol.abi, web3Context.provider?.getSigner());
      return contract.topUp([
        {
          tokenType: 1,
          token: asset.contract.address,
          tokenId: 0,
          amount: asset.amount,
        },
      ]) as Promise<any>;
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
          token: getEmptyToken(),
          address,
        }}
      />
    </Fragment>
  );
};
