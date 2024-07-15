import { FC, Fragment, useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, TokenType } from "@framework/types";

import MysteryMintBoxABI from "@framework/abis/json/ERC721MysteryBoxBlacklist/mintBox.json";

import type { IMintMysteryBoxDto } from "./dialog";
import { MysteryBoxMintDialog } from "./dialog";
import { shouldDisableByContractType } from "../../../../../utils";
import { useCheckPermissions } from "../../../../../../utils/use-check-permissions";

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

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMintMysteryBoxDto, web3Context: Web3ContextType) => {
    const contractMysteryBox = new Contract(address, MysteryMintBoxABI, web3Context.provider?.getSigner());
    const items = values.mysteryBox!.item!.components.map(item => ({
      tokenType: Object.values(TokenType).indexOf(item.tokenType),
      token: item.contract!.address,
      tokenId: item.templateId,
      amount: item.amount,
    }));

    return contractMysteryBox.mintBox(values.account, values.mysteryBox!.templateId, items) as Promise<any>;
  });

  const handleMintTokenConfirmed = async (values: IMintMysteryBoxDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsMintTokenDialogOpen(false);
    });
  };

  useEffect(() => {
    if (account) {
      void checkPermissions({
        account,
        address,
        role: AccessControlRoleType.MINTER_ROLE,
      }).then((json: { hasRole: boolean }) => {
        setHasAccess(json?.hasRole);
      });
    }
  }, [account]);

  return (
    <Fragment>
      <ListAction
        onClick={handleMintToken}
        icon={AddCircleOutline}
        message="form.buttons.mintToken"
        className={className}
        dataTestId="MysteryContractMintButton"
        disabled={disabled || shouldDisableByContractType(contract) || !hasAccess}
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
