import { FC, Fragment, useMemo, useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant, useListWrapperContext } from "@framework/styled";
import type { IContract } from "@framework/types";
import {
  AccessControlRoleHash,
  AccessControlRoleType,
  ContractSecurity,
  IPermission,
  IPermissionControl,
} from "@framework/types";

import grantRoleAccessControlFacetABI from "@framework/abis/json/AccessControlFacet/grantRole.json";

import { shouldDisableByContractType } from "../../utils";
import { AccessControlGrantRoleDialog, IGrantRoleDto } from "./dialog";

export interface IGrantRoleButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
  permissionRole?: AccessControlRoleType;
}

export const GrantRoleButton: FC<IGrantRoleButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractSecurity },
    disabled,
    variant,
    permissionRole = AccessControlRoleType.DEFAULT_ADMIN_ROLE,
  } = props;

  const [isGrantRoleDialogOpen, setIsGrantRoleDialogOpen] = useState(false);

  const context = useListWrapperContext<IPermissionControl, Array<IPermission>>();

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

  const isButtonAvailable = useMemo(() => {
    if (!contract || !context) return false;
    if (!context.callbackResponse[contract.id]) return false;
    return context.callbackResponse[contract.id].some(item => item.role === permissionRole) as boolean;
  }, [context, contract, permissionRole]);

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
        disabled={disabled || shouldDisableByContractType(contract) || !isButtonAvailable}
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
