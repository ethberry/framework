import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";
import type { IContract } from "@framework/types";
import { AccessControlRoleType } from "@framework/types";

import ERC721MysteryBoxSimpleMintBoxABI from "@framework/abis/json/ERC721MysteryBoxSimple/mintBox.json";

import { useSetButtonPermission } from "../../../../../../shared";
import { shouldDisableByContractType } from "../../../../utils";
import type { IMintMysteryBoxDto } from "./dialog";
import { MysteryBoxMintDialog } from "./dialog";

export interface IMysteryContractMintButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MysteryContractMintButton: FC<IMysteryContractMintButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, id: contractId },
    disabled,
    variant,
  } = props;

  const { account = "" } = useWeb3React();

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.MINTER_ROLE, contractId);

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMintMysteryBoxDto, web3Context: Web3ContextType) => {
    const contractMysteryBox = new Contract(
      address,
      ERC721MysteryBoxSimpleMintBoxABI,
      web3Context.provider?.getSigner(),
    );
    const content = convertDatabaseAssetToChainAsset(values.mysteryBox!.content!.components);
    return contractMysteryBox.mintBox(values.account, values.mysteryBox!.templateId, content) as Promise<any>;
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
        disabled={disabled || shouldDisableByContractType(contract) || !hasPermission}
        variant={variant}
      />
      <MysteryBoxMintDialog
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
