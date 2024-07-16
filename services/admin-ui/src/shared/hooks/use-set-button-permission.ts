import { AccessControlRoleType, IContract, IPermission, IPermissionControl } from "@framework/types";
import { useListWrapperContext } from "@framework/styled";
import { useMemo } from "react";

export const useSetButtonPermission = (permissionRole: AccessControlRoleType, contract: IContract) => {
  const context = useListWrapperContext<IPermissionControl, Array<IPermission>>();

  const isButtonAvailable = useMemo(() => {
    if (!contract || !context) return false;
    if (!context.callbackResponse[contract.id]) return false;
    return context.callbackResponse[contract.id].some(item => item.role === permissionRole) as boolean;
  }, [context, contract, permissionRole]);

  return {
    isButtonAvailable,
  };
};
