import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IVestingBox } from "@framework/types";
import { useMetamask } from "@ethberry/react-hooks-eth";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";
import { AccessControlRoleType } from "@framework/types";

import ERC721VestingMintBoxABI from "@framework/abis/json/ERC721Vesting/mintBox.json";

import { useSetButtonPermission } from "../../../../../../../shared";
import type { IMintVestingBoxDto } from "./dialog";
import { VestingBoxMintDialog } from "./dialog";

export interface IVestingBoxMintButtonProps {
  className?: string;
  vesting: IVestingBox;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const VestingBoxMintButton: FC<IVestingBoxMintButtonProps> = props => {
  const {
    className,
    vesting: { template },
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

  const metaFn = useMetamask((values: IMintVestingBoxDto, web3Context: Web3ContextType) => {
    const contractVestingbox = new Contract(
      template!.contract!.address,
      ERC721VestingMintBoxABI,
      web3Context.provider?.getSigner(),
    );
    const items = convertDatabaseAssetToChainAsset(values.vestingBox!.content!.components);
    return contractVestingbox.mintBox(values.account, values.vestingBox!.templateId, items) as Promise<any>;
  });

  const handleMintTokenConfirmed = async (values: IMintVestingBoxDto): Promise<void> => {
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
        dataTestId="VestingBoxMintButton"
        disabled={disabled || !hasPermission}
        variant={variant}
      />
      <VestingBoxMintDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId: template!.contractId,
          vestingId: 0,
          account,
        }}
      />
    </Fragment>
  );
};
