import { FC, Fragment, useEffect, useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleHash, AccessControlRoleType, ContractSecurity } from "@framework/types";

import GrantRoleABI from "@framework/abis/json/AccessControlFacet/grantRole.json";

import { AccessControlGrantRoleDialog, IGrantRoleDto } from "./dialog";
import { shouldDisableByContractType } from "../../../utils";
import { useCheckPermissions } from "../../../../utils/use-check-permissions";

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

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

  const handleGrantRole = (): void => {
    setIsGrantRoleDialogOpen(true);
  };

  const handleGrantRoleCancel = (): void => {
    setIsGrantRoleDialogOpen(false);
  };

  const metaFn = useMetamask((values: IGrantRoleDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, GrantRoleABI, web3Context.provider?.getSigner());
    return contract.grantRole(AccessControlRoleHash[values.role], values.address) as Promise<void>;
  });

  const handleGrantRoleConfirmed = async (values: IGrantRoleDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsGrantRoleDialogOpen(false);
    });
  };

  useEffect(() => {
    if (account) {
      void checkPermissions({
        account,
        address,
      }).then((json: { hasRole: boolean }) => {
        setHasAccess(json?.hasRole);
      });
    }
  }, [account]);

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
