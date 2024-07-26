import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IMysteryBox } from "@framework/types";
import { AccessControlRoleType, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import MysteryMintBoxABI from "@framework/abis/json/ERC721MysteryBoxBlacklist/mintBox.json";

import type { IMysteryBoxMintDto } from "./dialog";
import { MysteryBoxMintDialog } from "./dialog";
import { useSetButtonPermission } from "../../../../../../shared";

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

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.MINTER_ROLE, template?.contract?.id);

  const { account = "" } = useWeb3React();

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMysteryBoxMintDto, web3Context: Web3ContextType) => {
    const contractMysterybox = new Contract(
      template!.contract!.address,
      MysteryMintBoxABI,
      web3Context.provider?.getSigner(),
    );
    const items = values.mysteryBox!.item!.components.map(item => {
      let tokenId;
      if (item?.contract?.contractType === TokenType.ERC1155) {
        tokenId = item.template?.tokens?.[0]?.tokenId;
      } else {
        tokenId = item.templateId;
      }

      return {
        tokenType: Object.values(TokenType).indexOf(item.tokenType),
        token: item.contract!.address,
        tokenId,
        amount: item.amount,
      };
    });
    return contractMysterybox.mintBox(values.account, values.mysteryBox!.templateId, items) as Promise<any>;
  });

  const handleMintTokenConfirmed = async (values: IMysteryBoxMintDto): Promise<void> => {
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
        dataTestId="MysteryBoxMintButton"
        disabled={disabled || !hasPermission}
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
