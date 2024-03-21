import { FC, Fragment, useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { constants, Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";

import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { ITemplateAsset, ITemplateAssetComponent } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IUser } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";

import mintERC20BlacklistABI from "@framework/abis/mint/ERC20Blacklist.json";
import mintCommonERC721BlacklistABI from "@framework/abis/mintCommon/ERC721Blacklist.json";
import mintERC1155BlacklistABI from "@framework/abis/mint/ERC1155Blacklist.json";

import { useCheckAccessMint } from "../../../../../utils/use-check-access";
import { shouldDisableByContractType } from "../../../utils";
import type { IMintTokenDto } from "./dialog";
import { MintTokenDialog } from "./dialog";

export interface IMintButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MintButton: FC<IMintButtonProps> = props => {
  const {
    className,
    contract: { address, id: contractId, contractFeatures, contractType, decimals },
    disabled,
    variant,
  } = props;

  const { account } = useWeb3React();
  const { profile } = useUser<IUser>();

  const [hasAccess, setHasAccess] = useState(false);

  const [isMintTokenDialogOpen, setIsMintTokenDialogOpen] = useState(false);
  const { checkAccessMint } = useCheckAccessMint();

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
        mintERC20BlacklistABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc20["mint(address,uint256)"](values.account, templateComponent.amount) as Promise<any>;
    } else if (templateComponent.tokenType === TokenType.ERC721 || templateComponent.tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        templateComponent.contract.address,
        mintCommonERC721BlacklistABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.mintCommon(values.account, templateComponent.templateId) as Promise<any>;
    } else if (templateComponent.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        templateComponent.contract.address,
        mintERC1155BlacklistABI,
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
    if (account || profile?.wallet) {
      void checkAccessMint(void 0, {
        account: account || profile?.wallet,
        address,
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
        dataTestId="ContractMintButton"
        disabled={
          disabled ||
          shouldDisableByContractType(props.contract) ||
          contractType === TokenType.NATIVE ||
          contractFeatures.includes(ContractFeatures.GENES) ||
          !hasAccess
        }
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
                  tokens: [],
                },
                tokenId: 0,
                templateId: 0,
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
