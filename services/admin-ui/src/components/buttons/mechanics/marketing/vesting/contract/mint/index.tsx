import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";
import type { IContract } from "@framework/types";
import { AccessControlRoleType } from "@framework/types";
import ERC721VestingMintBoxABI from "@framework/abis/json/ERC721Vesting/mintBox.json";

import { useSetButtonPermission } from "../../../../../../../shared";
import { shouldDisableByContractType } from "../../../../../utils";
import type { IMintVestingBoxDto } from "./dialog";
import { MintVestingBoxDialog } from "./dialog";

export interface IVestingContractMintButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const VestingContractMintButton: FC<IVestingContractMintButtonProps> = props => {
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

  const metaFn = useMetamask((values: IMintVestingBoxDto, web3Context: Web3ContextType) => {
    const contractVestingBox = new Contract(address, ERC721VestingMintBoxABI, web3Context.provider?.getSigner());
    const items = convertDatabaseAssetToChainAsset(values.vestingBox!.content!.components);
    return contractVestingBox.mintBox(values.account, values.vestingBox!.templateId, items) as Promise<any>;
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
        dataTestId="VestingContractMintButton"
        disabled={disabled || shouldDisableByContractType(contract) || !hasPermission}
        variant={variant}
      />
      <MintVestingBoxDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId,
          vestingId: 0,
          account,
        }}
      />
    </Fragment>
  );
};
