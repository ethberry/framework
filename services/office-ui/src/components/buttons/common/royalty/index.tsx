import { FC, Fragment, useState } from "react";
import { PaidOutlined } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures, TokenType } from "@framework/types";

import RoyaltySetDefaultRoyaltyABI from "@framework/abis/json/ERC1155Blacklist/setDefaultRoyalty.json";

import type { IRoyaltyDto } from "./dialog";
import { RoyaltyEditDialog } from "./dialog";
import { shouldDisableByContractType } from "../../../utils";
import { useSetButtonPermission } from "../../../../shared";

export interface IRoyaltyButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RoyaltyButton: FC<IRoyaltyButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures, royalty, contractType },
    disabled,
    variant,
  } = props;

  const [isRoyaltyDialogOpen, setIsRoyaltyDialogOpen] = useState(false);

  const { isButtonAvailable } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, contract?.id);

  const handleRoyalty = (): void => {
    setIsRoyaltyDialogOpen(true);
  };

  const handleRoyaltyCancel = (): void => {
    setIsRoyaltyDialogOpen(false);
  };

  const metaFn = useMetamask((values: IRoyaltyDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, RoyaltySetDefaultRoyaltyABI, web3Context.provider?.getSigner());
    return contract.setDefaultRoyalty(web3Context.account, values.royalty) as Promise<void>;
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
        dataTestId="RoyaltyButton"
        disabled={
          disabled ||
          shouldDisableByContractType(contract) ||
          contractFeatures.includes(ContractFeatures.SOULBOUND) ||
          !isButtonAvailable
        }
        variant={variant}
      />
      <RoyaltyEditDialog
        onCancel={handleRoyaltyCancel}
        onConfirm={handleRoyaltyConfirmed}
        open={isRoyaltyDialogOpen}
        initialValues={{ royalty }}
      />
    </Fragment>
  );
};
