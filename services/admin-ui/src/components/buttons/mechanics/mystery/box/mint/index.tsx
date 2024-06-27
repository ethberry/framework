import { FC, Fragment, useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import { AccessControlRoleType, type IMysteryBox } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import mintBoxERC721MysteryBoxBlacklistABI from "@framework/abis/mintBox/ERC721MysteryBoxBlacklist.json";

import type { IMintMysteryBoxDto } from "./dialog";
import { MysteryBoxMintDialog } from "./dialog";
import { useCheckPermissions } from "../../../../../../utils/use-check-permissions";

export interface IMysteryBoxMintButtonProps {
  className?: string;
  mystery: IMysteryBox;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MysteryBoxMintButton: FC<IMysteryBoxMintButtonProps> = props => {
  const {
    className,
    mystery: { template },
    disabled,
    variant,
  } = props;

  const { account = "" } = useWeb3React();

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);

  const { fn: checkAccess } = useCheckPermissions();

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMintMysteryBoxDto, web3Context: Web3ContextType) => {
    const contractMysterybox = new Contract(
      template!.contract!.address,
      mintBoxERC721MysteryBoxBlacklistABI,
      web3Context.provider?.getSigner(),
    );
    const items = convertDatabaseAssetToChainAsset(values.mysteryBox!.item!.components);
    return contractMysterybox.mintBox(values.account, values.mysteryBox!.templateId, items) as Promise<any>;
  });

  const handleMintTokenConfirmed = async (values: IMintMysteryBoxDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsMintTokenDialogOpen(false);
    });
  };

  useEffect(() => {
    if (account) {
      void checkAccess(void 0, {
        account,
        address: template!.contract!.address,
        role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [account]);

  return (
    <Fragment>
      <ListAction
        onClick={handleMintToken}
        icon={AddCircleOutline}
        message="form.buttons.mintToken"
        className={className}
        dataTestId="MysteryBoxMintButton"
        disabled={disabled || !hasAccess}
        variant={variant}
      />
      <MysteryBoxMintDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId: template!.contractId,
          mysteryId: 0,
          account,
        }}
      />
    </Fragment>
  );
};
