import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import FundEthABI from "./fundEth.abi.json";

import { IFundEthDto, FundEthEditDialog } from "./dialog";

export interface IFundEthMenuItemProps {
  contract: IContract;
}

export const FundEthMenuItem: FC<IFundEthMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isFundEthDialogOpen, setIsFundEthDialogOpen] = useState(false);

  const handleFundEth = (): void => {
    setIsFundEthDialogOpen(true);
  };

  const handleFundEthCancel = (): void => {
    setIsFundEthDialogOpen(false);
  };

  const metaFn = useMetamask((values: IFundEthDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, FundEthABI, web3Context.provider?.getSigner());
    return contract.fundEth({ value: values.amount }) as Promise<void>;
  });

  const handleFundEthConfirmed = async (values: IFundEthDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsFundEthDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleFundEth}>
        <ListItemIcon>
          <PaidOutlined fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.fundEth" />
        </Typography>
      </MenuItem>
      <FundEthEditDialog
        onCancel={handleFundEthCancel}
        onConfirm={handleFundEthConfirmed}
        open={isFundEthDialogOpen}
        initialValues={{ amount: 0 }}
      />
    </Fragment>
  );
};
