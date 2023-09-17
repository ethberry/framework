import { FC, Fragment, useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { constants, Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { ITemplateAsset, ITemplateAssetComponent } from "@gemunion/mui-inputs-asset";
import type { ITemplate, IUser } from "@framework/types";
import { TokenType } from "@framework/types";

import ERC20MintABI from "../../../../../abis/hierarchy/erc20/mint/erc20.mint.abi.json";
import ERC721MintCommonABI from "../../../../../abis/hierarchy/erc721/mint/erc721.mintCommon.abi.json";
import ERC1155MintABI from "../../../../../abis/hierarchy/erc1155/mint/erc1155.mint.abi.json";

import { useCheckAccessMint } from "../../../../../utils/use-check-access-mint";
import { ListAction, ListActionVariant } from "../../../../common/lists";
import { IMintTokenDto, MintTokenDialog } from "./dialog";

export interface IMintMenuItemProps {
  template: ITemplate;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MintMenuItem: FC<IMintMenuItemProps> = props => {
  const {
    template: { contract, id: templateId, tokens },
    disabled,
    variant,
  } = props;

  const { profile } = useUser<IUser>();
  const { checkAccessMint } = useCheckAccessMint();
  const [hasAccess, setHasAccess] = useState(false);

  const { address, contractType, id: contractId, decimals } = contract!;

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);

  const handleMintToken = (): void => {
    setIsMintTokenDialogOpen(true);
  };

  const handleMintTokenCancel = (): void => {
    setIsMintTokenDialogOpen(false);
  };

  const metaFn = useMetamask((values: IMintTokenDto, web3Context: Web3ContextType) => {
    const templateComponent = values.template.components[0];

    if (templateComponent.tokenType === TokenType.ERC20) {
      const contractErc20 = new Contract(
        templateComponent.contract.address,
        ERC20MintABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc20.mint(values.account, templateComponent.amount) as Promise<any>;
    } else if (templateComponent.tokenType === TokenType.ERC721 || templateComponent.tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        templateComponent.contract.address,
        ERC721MintCommonABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.mintCommon(values.account, templateComponent.templateId) as Promise<any>;
    } else if (templateComponent.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        templateComponent.contract.address,
        ERC1155MintABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc1155.mint(
        values.account,
        (templateComponent.template as any).tokens[0].tokenId,
        templateComponent.amount,
        "0x",
      ) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleMintTokenConfirmed = async (values: IMintTokenDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsMintTokenDialogOpen(false);
    });
  };

  useEffect(() => {
    if (profile?.wallet) {
      void checkAccessMint(void 0, {
        account: profile.wallet,
        address: contract?.address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [profile?.wallet]);

  return (
    <Fragment>
      <ListAction
        onClick={handleMintToken}
        disabled={disabled || !hasAccess}
        icon={AddCircleOutline}
        message="form.buttons.mintToken"
        variant={variant}
      />
      <MintTokenDialog
        onCancel={handleMintTokenCancel}
        onConfirm={handleMintTokenConfirmed}
        open={isMintTokenDialogOpen}
        initialValues={{
          template: {
            components: [
              {
                tokenType: contractType,
                contractId,
                contract: {
                  decimals,
                  address,
                  contractType,
                },
                template: {
                  id: 0,
                  tokens,
                },
                templateId,
                amount: contractType === TokenType.ERC20 ? constants.WeiPerEther.toString() : "1",
              } as unknown as ITemplateAssetComponent,
            ],
          } as ITemplateAsset,
          account: profile.wallet,
        }}
      />
    </Fragment>
  );
};
