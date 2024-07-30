import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import mintBoxERC721LootBoxBlacklistABI from "@framework/abis/json/ERC721LootBoxSimple/mintBox.json";

import { shouldDisableByContractType } from "../../../../utils";
import type { IMintLootBoxDto } from "./dialog";
import { MintLootBoxDialog } from "./dialog";

export interface ILootContractMintButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const LootContractMintButton: FC<ILootContractMintButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, id: contractId },
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
    const contractLootBox = new Contract(address, mintBoxERC721LootBoxBlacklistABI, web3Context.provider?.getSigner());
    const items = convertDatabaseAssetToChainAsset(values.lootBox!.item!.components);
    return contractLootBox.mintBox(values.account, values.lootBox!.templateId, items) as Promise<any>;
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
        dataTestId="LootContractMintButton"
        disabled={disabled || shouldDisableByContractType(contract)}
        variant={variant}
      />
      <MintLootBoxDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId,
          lootId: 0,
          account,
        }}
      />
    </Fragment>
  );
};
