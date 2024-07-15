import { FC, Fragment, useEffect, useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant, useListWrapperContext } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleHash, AccessControlRoleType, ContractSecurity } from "@framework/types";

import grantRoleAccessControlFacetABI from "@framework/abis/grantRole/AccessControlFacet.json";

import { shouldDisableByContractType } from "../../utils";
import { AccessControlGrantRoleDialog, IGrantRoleDto } from "./dialog";

export interface IGrantRoleButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const GrantRoleButton: FC<IGrantRoleButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractSecurity },
    disabled,
    variant,
  } = props;

  const [isGrantRoleDialogOpen, setIsGrantRoleDialogOpen] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);

  const context = useListWrapperContext();

  const handleGrantRole = (): void => {
    setIsGrantRoleDialogOpen(true);
  };

  const handleGrantRoleCancel = (): void => {
    setIsGrantRoleDialogOpen(false);
  };

  const metaFn = useMetamask((values: IGrantRoleDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, grantRoleAccessControlFacetABI, web3Context.provider?.getSigner());
    return contract.grantRole(AccessControlRoleHash[values.role], values.address) as Promise<void>;
  });

  const handleGrantRoleConfirmed = async (values: IGrantRoleDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsGrantRoleDialogOpen(false);
    });
  };

  useEffect(() => {
    if (!contract || !context) return;
    if (context.callbackResponse) {
      context.callbackResponse[contract.id] && setHasAccess(context.callbackResponse[contract.id].hasRole);
    }
  }, [contract, context]);

  if (contractSecurity !== ContractSecurity.ACCESS_CONTROL) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleGrantRole}
        icon={AccountCircle}
        message="form.buttons.grantRole"
        className={className}
        dataTestId="GrantRoleButton"
        disabled={disabled || shouldDisableByContractType(contract) || !hasAccess}
        variant={variant}
      />
      <AccessControlGrantRoleDialog
        onCancel={handleGrantRoleCancel}
        onConfirm={handleGrantRoleConfirmed}
        open={isGrantRoleDialogOpen}
        initialValues={{
          role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
          address: "",
        }}
      />
    </Fragment>
  );
};
