import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { ILootBox } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import mintBoxERC721LootBoxBlacklistABI from "@framework/abis/mintBox/ERC721LootBoxBlacklist.json";

import type { IMintLootBoxDto } from "./dialog";
import { LootBoxMintDialog } from "./dialog";

export interface ILootBoxMintButtonProps {
  className?: string;
  loot: ILootBox;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const LootBoxMintButton: FC<ILootBoxMintButtonProps> = props => {
  const {
    className,
    loot: { template },
    disabled,
    variant,
  } = props;

  const { account = "" } = useWeb3React();

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMintLootBoxDto, web3Context: Web3ContextType) => {
    const contractLootbox = new Contract(
      template!.contract!.address,
      mintBoxERC721LootBoxBlacklistABI,
      web3Context.provider?.getSigner(),
    );
    const items = convertDatabaseAssetToChainAsset(values.lootBox!.item!.components);
    return contractLootbox.mintBox(values.account, values.lootBox!.templateId, items) as Promise<any>;
  });

  const handleMintTokenConfirmed = async (values: IMintLootBoxDto): Promise<void> => {
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
        className={className}
        dataTestId="LootBoxMintButton"
        disabled={disabled}
        variant={variant}
      />
      <LootBoxMintDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId: template!.contractId,
          lootId: 0,
          account,
        }}
      />
    </Fragment>
  );
};
