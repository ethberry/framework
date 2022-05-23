import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useMetamask } from "@gemunion/react-hooks";
import erc721contract from "@framework/binance-contracts/artifacts/contracts/ERC721/interfaces/IERC721Royalty.sol/IERC721Royalty.json";

import { Erc721CollectionRoyaltyEditDialog, IRoyaltyDto } from "./edit";

export interface IErc721CollectionRoyaltyMenuItemProps {
  address: string;
  royalty: number;
}

export const Erc721CollectionRoyaltyMenuItem: FC<IErc721CollectionRoyaltyMenuItemProps> = props => {
  const { address, royalty } = props;

  const [isRoyaltyDialogOpen, setIsRoyaltyDialogOpen] = useState(false);

  const { library, account } = useWeb3React();

  const handleRoyalty = (): void => {
    setIsRoyaltyDialogOpen(true);
  };

  const handleRoyaltyCancel = (): void => {
    setIsRoyaltyDialogOpen(false);
  };

  const meta = useMetamask((values: IRoyaltyDto) => {
    const contract = new Contract(address, erc721contract.abi, library.getSigner());
    return contract.setDefaultRoyalty(account, values.royalty) as Promise<void>;
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
      <Erc721CollectionRoyaltyEditDialog
        onCancel={handleRoyaltyCancel}
        onConfirm={handleRoyaltyConfirmed}
        open={isRoyaltyDialogOpen}
        initialValues={{ royalty }}
      />
    </>
  );
};
