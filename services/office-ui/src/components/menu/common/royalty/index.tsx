import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import SetDefaultRoyaltyABI from "./setDefaultRoyalty.abi.json";

import { IRoyaltyDto, RoyaltyEditDialog } from "./dialog";
import { ContractFeatures } from "@framework/types";

export interface IRoyaltyMenuItemProps {
  contract: IContract;
}

export const RoyaltyMenuItem: FC<IRoyaltyMenuItemProps> = props => {
  const {
    contract: { address, contractFeatures, royalty },
  } = props;

  const [isRoyaltyDialogOpen, setIsRoyaltyDialogOpen] = useState(false);

  const handleRoyalty = (): void => {
    setIsRoyaltyDialogOpen(true);
  };

  const handleRoyaltyCancel = (): void => {
    setIsRoyaltyDialogOpen(false);
  };

  const metaFn = useMetamask((values: IRoyaltyDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, SetDefaultRoyaltyABI, web3Context.provider?.getSigner());
    return contract.setDefaultRoyalty(web3Context.account, values.royalty) as Promise<void>;
  });

  const handleRoyaltyConfirmed = async (values: IRoyaltyDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsRoyaltyDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleRoyalty} disabled={contractFeatures.includes(ContractFeatures.SOULBOUND)}>
        <ListItemIcon>
          <PaidOutlined fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.royalty" />
        </Typography>
      </MenuItem>
      <RoyaltyEditDialog
        onCancel={handleRoyaltyCancel}
        onConfirm={handleRoyaltyConfirmed}
        open={isRoyaltyDialogOpen}
        initialValues={{ royalty }}
      />
    </Fragment>
  );
};
