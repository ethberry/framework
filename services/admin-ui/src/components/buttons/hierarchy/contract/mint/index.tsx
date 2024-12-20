import { FC, Fragment, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { constants, Contract } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { ITemplateAsset, ITemplateAssetComponent } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures, TokenType } from "@framework/types";

import ERC20SimpleMintABI from "@framework/abis/json/ERC20Simple/mint.json";
import ERC721SimpleMintCommonABI from "@framework/abis/json/ERC721Simple/mintCommon.json";
import ERC1155SimpleMintABI from "@framework/abis/json/ERC1155Simple/mint.json";

import { shouldDisableByContractType } from "../../../utils";
import type { IMintTokenDto } from "./dialog";
import { MintTokenDialog } from "./dialog";
import { useSetButtonPermission } from "../../../../../shared";

export interface IContractMintButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ContractMintButton: FC<IContractMintButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, id: contractId, contractFeatures, contractType, decimals },
    disabled,
    variant,
  } = props;

  const { account = "" } = useWeb3React();

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.MINTER_ROLE, contract?.id);

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
        ERC20SimpleMintABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc20["mint(address,uint256)"](values.account, templateComponent.amount) as Promise<any>;
    } else if (templateComponent.tokenType === TokenType.ERC721 || templateComponent.tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        templateComponent.contract.address,
        ERC721SimpleMintCommonABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.mintCommon(values.account, templateComponent.templateId) as Promise<any>;
    } else if (templateComponent.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        templateComponent.contract.address,
        ERC1155SimpleMintABI,
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
          shouldDisableByContractType(contract) ||
          contractType === TokenType.NATIVE ||
          contractFeatures.includes(ContractFeatures.GENES) ||
          !hasPermission
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
          account,
        }}
      />
    </Fragment>
  );
};
