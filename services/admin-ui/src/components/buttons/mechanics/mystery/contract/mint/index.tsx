import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract, IUser } from "@framework/types";
import { TokenType } from "@framework/types";

import MysteryMintBoxABI from "../../../../../../abis/mechanics/mystery-box/mint/mysterybox.mintBox.abi.json";

import { IMintMysteryBoxDto, MintMysteryBoxDialog } from "./dialog";

export interface IMysteryBoxMintButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MysteryBoxMintButton: FC<IMysteryBoxMintButtonProps> = props => {
  const {
    className,
    contract: { address, id: contractId },
    disabled,
    variant,
  } = props;

  const { profile } = useUser<IUser>();

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

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

  return (
    <Fragment>
      <ListAction
        onClick={handleMintToken}
        icon={AddCircleOutline}
        message="form.buttons.mintToken"
        className={className}
        dataTestId="MysteryContractMintButton"
        disabled={disabled}
        variant={variant}
      />
      <MintMysteryBoxDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          contractId,
          mysteryId: 0,
          account: profile.wallet,
        }}
      />
    </Fragment>
  );
};
