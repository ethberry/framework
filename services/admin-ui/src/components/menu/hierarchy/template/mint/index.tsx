import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { constants, Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { ITemplate } from "@framework/types";
import { ContractFeatures, IUser, TokenType } from "@framework/types";
import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { ITemplateAsset, ITemplateAssetComponent } from "@gemunion/mui-inputs-asset";

import ERC20MintABI from "../../../../../abis/hierarchy/erc20/mint/erc20.mint.abi.json";
import ERC721MintCommonABI from "../../../../../abis/hierarchy/erc721/mint/erc721.mintCommon.abi.json";
import ERC1155MintABI from "../../../../../abis/hierarchy/erc1155/mint/erc1155.mint.abi.json";

import { IMintTokenDto, MintTokenDialog } from "./dialog";

export interface IMintMenuItemProps {
  template: ITemplate;
}

export const MintMenuItem: FC<IMintMenuItemProps> = props => {
  const {
    template: { contract, id: templateId, tokens },
  } = props;

  const { profile } = useUser<IUser>();

  const { address, contractType, id: contractId, decimals, contractFeatures } = contract!;

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

  if (contractType === TokenType.NATIVE || contractFeatures.includes(ContractFeatures.GENES)) {
    return (
      <MenuItem>
        <Typography variant="inherit">
          <FormattedMessage id="dialogs.unsupported" />
        </Typography>
      </MenuItem>
    );
  }

  return (
    <Fragment>
      <MenuItem onClick={handleMintToken}>
        <ListItemIcon>
          <AddCircleOutline />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.mintToken" />
        </Typography>
      </MenuItem>
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
