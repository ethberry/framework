import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";

import { IRoyaltyDto, RoyaltyEditDialog } from "./edit";

export interface IRoyaltyMenuItemProps {
  address: string;
  royalty: number;
}

export const RoyaltyMenuItem: FC<IRoyaltyMenuItemProps> = props => {
  const { address, royalty } = props;

  const [isRoyaltyDialogOpen, setIsRoyaltyDialogOpen] = useState(false);

  const handleRoyalty = (): void => {
    setIsRoyaltyDialogOpen(true);
  };

  const handleRoyaltyCancel = (): void => {
    setIsRoyaltyDialogOpen(false);
  };

  const meta = useMetamask((values: IRoyaltyDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, ERC721SimpleSol.abi, web3Context.provider?.getSigner());
    return contract.setDefaultRoyalty(web3Context.account, values.royalty) as Promise<void>;
  });

  const handleRoyaltyConfirmed = async (values: IRoyaltyDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsRoyaltyDialogOpen(false);
    });
  };

  return (
    <>
      <MenuItem onClick={handleRoyalty}>
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
    </>
  );
};
