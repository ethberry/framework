import { FC, Fragment, useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { constants, Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { ITemplateAsset, ITemplateAssetComponent } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { ITemplate } from "@framework/types";
import { ContractFeatures, TemplateStatus, TokenType } from "@framework/types";

import ERC20MintABI from "@framework/abis/mint/ERC20Blacklist.json";
import ERC721MintCommonABI from "@framework/abis/mintCommon/ERC721Blacklist.json";
import ERC1155MintABI from "@framework/abis/mint/ERC1155Blacklist.json";

import { useCheckAccessMint } from "../../../../../utils/use-check-access-mint";
import type { IMintTokenDto } from "./dialog";
import { MintTokenDialog } from "./dialog";

export interface IMintButtonProps {
  className?: string;
  disabled?: boolean;
  template: ITemplate;
  variant?: ListActionVariant;
}

export const MintButton: FC<IMintButtonProps> = props => {
  const {
    className,
    template: { contract, id: templateId, templateStatus, tokens },
    disabled,
    variant,
  } = props;

  const { account = "" } = useWeb3React();

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
    if (account) {
      void checkAccessMint(void 0, {
        account,
        address: contract?.address,
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
        dataTestId="TemplateMintButton"
        disabled={
          disabled ||
          templateStatus === TemplateStatus.INACTIVE ||
          contract?.contractType === TokenType.NATIVE ||
          contract?.contractFeatures.includes(ContractFeatures.GENES) ||
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
                  tokens,
                },
                templateId,
                amount: contractType === TokenType.ERC20 ? constants.WeiPerEther.toString() : "1",
              } as unknown as ITemplateAssetComponent,
            ],
          } as ITemplateAsset,
          account,
        }}
      />
    </Fragment>
  );
};
