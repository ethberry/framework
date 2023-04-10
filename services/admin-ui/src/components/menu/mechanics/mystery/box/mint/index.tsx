import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { IMysterybox } from "@framework/types";
import { IUser, TokenType } from "@framework/types";
import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";

import MysteryMintBoxABI from "../../../../../../abis/components/menu/mechanics/mystery/mint/mysterybox.mintBox.abi.json";

import { IMintMysteryboxDto, MintMysteryboxDialog } from "./dialog";

export interface IMintMenuItemProps {
  mystery: IMysterybox;
}

export const MintMenuItem: FC<IMintMenuItemProps> = props => {
  const {
    mystery: { template },
  } = props;

  const user = useUser<IUser>();

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMintMysteryboxDto, web3Context: Web3ContextType) => {
    const contractMysterybox = new Contract(
      template!.contract!.address,
      MysteryMintBoxABI,
      web3Context.provider?.getSigner(),
    );
    const items = values.mysterybox!.item!.components.map(item => ({
      tokenType: Object.keys(TokenType).indexOf(item.tokenType),
      token: item.contract!.address,
      tokenId: item.templateId,
      amount: item.amount,
    }));
    return contractMysterybox.mintBox(values.account, values.mysterybox!.templateId, items) as Promise<any>;
  });

  const handleMintTokenConfirmed = async (values: IMintMysteryboxDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsMintTokenDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleMintToken}>
        <ListItemIcon>
          <AddCircleOutlineIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.mintToken" />
        </Typography>
      </MenuItem>
      <MintMysteryboxDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId: template!.contractId,
          mysteryId: 0,
          account: user.profile.wallet,
        }}
      />
    </Fragment>
  );
};
