import { FC, Fragment, useState } from "react";
import { PaidOutlined } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";
import { AccessControlRoleType, ContractFeatures, TokenType } from "@framework/types";

import ERC721SimpleSetTokenRoyalty from "@framework/abis/json/ERC721Simple/setTokenRoyalty.json";

import { useSetButtonPermission } from "../../../../shared";
import { shouldDisableByContractType } from "../../utils";
import type { IRoyaltyDto } from "./dialog";
import { RoyaltyEditDialog } from "./dialog";

export interface ITokenRoyaltyButtonProps {
  className?: string;
  token: IToken;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const TokenRoyaltyButton: FC<ITokenRoyaltyButtonProps> = props => {
  const { className, token, disabled, variant } = props;

  const { address, contractFeatures, royalty, contractType } = token.template!.contract!;

  const [isRoyaltyDialogOpen, setIsRoyaltyDialogOpen] = useState(false);

  const { hasPermission } = useSetButtonPermission(
    AccessControlRoleType.DEFAULT_ADMIN_ROLE,
    token.template!.contract!.id,
  );

  const handleRoyalty = (): void => {
    setIsRoyaltyDialogOpen(true);
  };

  const handleRoyaltyCancel = (): void => {
    setIsRoyaltyDialogOpen(false);
  };

  const metaFn = useMetamask((values: IRoyaltyDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, ERC721SimpleSetTokenRoyalty, web3Context.provider?.getSigner());
    return contract.setTokenRoyalty(token.tokenId, web3Context.account, values.royalty) as Promise<void>;
  });

  const handleRoyaltyConfirmed = async (values: IRoyaltyDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsRoyaltyDialogOpen(false);
    });
  };

  if (contractType === TokenType.NATIVE || contractType === TokenType.ERC20) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleRoyalty}
        icon={PaidOutlined}
        message="form.buttons.royalty"
        className={className}
        dataTestId="TokenRoyaltyButton"
        disabled={
          disabled ||
          shouldDisableByContractType(token.template!.contract!) ||
          contractFeatures.includes(ContractFeatures.SOULBOUND) ||
          !hasPermission
        }
        variant={variant}
      />
      <RoyaltyEditDialog
        onCancel={handleRoyaltyCancel}
        onConfirm={handleRoyaltyConfirmed}
        open={isRoyaltyDialogOpen}
        initialValues={{ royalty: token.royalty || royalty }}
      />
    </Fragment>
  );
};
