import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { IMysteryBox } from "@framework/types";
import { IUser, TokenType } from "@framework/types";
import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";

import MysteryMintBoxABI from "../../../../../../abis/mechanics/mystery-box/mint/mysterybox.mintBox.abi.json";

import { IMintMysteryboxDto, MintMysteryboxDialog } from "./dialog";

export interface IMintMenuItemProps {
  mystery: IMysteryBox;
}

export const MintMenuItem: FC<IMintMenuItemProps> = props => {
  const {
    mystery: { template },
  } = props;

  const { profile } = useUser<IUser>();

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
      tokenType: Object.values(TokenType).indexOf(item.tokenType),
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
          <AddCircleOutline />
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
          account: profile.wallet,
        }}
      />
    </Fragment>
  );
};
