import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import type { IMysteryBox } from "@framework/types";
import { IUser, TokenType } from "@framework/types";
import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";

import MysteryMintBoxABI from "../../../../../../abis/mechanics/mystery-box/mint/mysterybox.mintBox.abi.json";

import { ListAction, ListActionVariant } from "../../../../../common/lists";
import { IMintMysteryboxDto, MintMysteryboxDialog } from "./dialog";

export interface IMintMenuItemProps {
  mystery: IMysteryBox;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MintMenuItem: FC<IMintMenuItemProps> = props => {
  const {
    mystery: { template },
    disabled,
    variant,
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
      <ListAction
        onClick={handleMintToken}
        icon={AddCircleOutline}
        message="form.buttons.mintToken"
        disabled={disabled}
        variant={variant}
      />
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
