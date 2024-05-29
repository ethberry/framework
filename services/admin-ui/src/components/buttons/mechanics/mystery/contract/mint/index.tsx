import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";

import mintBoxERC721MysteryBoxBlacklistABI from "@framework/abis/mintBox/ERC721MysteryBoxBlacklist.json";

import { convertDatabaseAssetToChainAsset } from "@framework/exchange";
import { shouldDisableByContractType } from "../../../../utils";
import type { IMintMysteryBoxDto } from "./dialog";
import { MintMysteryBoxDialog } from "./dialog";

export interface IMysteryBoxMintButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MysteryBoxMintButton: FC<IMysteryBoxMintButtonProps> = props => {
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

  const metaFn = useMetamask((values: IMintMysteryBoxDto, web3Context: Web3ContextType) => {
    const contractMysteryBox = new Contract(
      address,
      mintBoxERC721MysteryBoxBlacklistABI,
      web3Context.provider?.getSigner(),
    );
    const items = convertDatabaseAssetToChainAsset(values.mysteryBox!.item!.components);

    return contractMysteryBox.mintBox(values.account, values.mysteryBox!.templateId, items) as Promise<any>;
  });

  const handleMintTokenConfirmed = async (values: IMintMysteryBoxDto): Promise<void> => {
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
        dataTestId="MysteryContractMintButton"
        disabled={disabled || shouldDisableByContractType(contract)}
        variant={variant}
      />
      <MintMysteryBoxDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId,
          mysteryId: 0,
          account,
        }}
      />
    </Fragment>
  );
};
