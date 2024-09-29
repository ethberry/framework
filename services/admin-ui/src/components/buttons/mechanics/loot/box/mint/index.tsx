import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { ILootBox } from "@framework/types";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";
import { AccessControlRoleType } from "@framework/types";

import ERC721LootBoxSimpleMintBoxABI from "@framework/abis/json/ERC721LootBoxSimple/mintBox.json";

import { useSetButtonPermission } from "../../../../../../shared";
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

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.MINTER_ROLE, template?.contract?.id);

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMintLootBoxDto, web3Context: Web3ContextType) => {
    const contractLootbox = new Contract(
      template!.contract!.address,
      ERC721LootBoxSimpleMintBoxABI,
      web3Context.provider?.getSigner(),
    );
    const items = convertDatabaseAssetToChainAsset(values.lootBox!.content!.components);
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
        disabled={disabled || !hasPermission}
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
