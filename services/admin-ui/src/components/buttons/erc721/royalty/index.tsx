import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { IErc721Collection } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";
import erc721contract from "@framework/binance-contracts/artifacts/contracts/ERC721/interface/IERC721Royalty.sol/IERC721Royalty.json";

import { Erc721CollectionRoyaltyEditDialog, IRoyaltyDto } from "./edit";

export interface IErc721CollectionRoyaltyButtonProps {
  collection: IErc721Collection;
}

export const Erc721CollectionRoyaltyButton: FC<IErc721CollectionRoyaltyButtonProps> = props => {
  const { collection } = props;

  const [isRoyaltyDialogOpen, setIsRoyaltyDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const { library, account } = useWeb3React();

  const handleRoyalty = (): void => {
    setIsRoyaltyDialogOpen(true);
  };

  const handleRoyaltyCancel = (): void => {
    setIsRoyaltyDialogOpen(false);
  };

  const meta = useMetamask((values: IRoyaltyDto) => {
    const contract = new ethers.Contract(collection.address, erc721contract.abi, library.getSigner());
    return contract.setDefaultRoyalty(account, values.royalty) as Promise<void>;
  });

  const handleRoyaltyConfirmed = async (values: IRoyaltyDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsRoyaltyDialogOpen(false);
    });
  };

  return (
    <>
      <Tooltip title={formatMessage({ id: "pages.erc721-collections.royalty" })}>
        <IconButton onClick={handleRoyalty} data-testid="Erc721CollectionRoyaltyButton">
          <PaidOutlined />
        </IconButton>
      </Tooltip>
      <Erc721CollectionRoyaltyEditDialog
        onCancel={handleRoyaltyCancel}
        onConfirm={handleRoyaltyConfirmed}
        open={isRoyaltyDialogOpen}
        initialValues={{ royalty: collection.royalty }}
      />
    </>
  );
};
