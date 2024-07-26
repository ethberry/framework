import { AccessControlRoleType, IAccessControl } from "@framework/types";
import { useListItemContext } from "@framework/styled";
import { useMemo } from "react";

export const useSetButtonPermission = (permissionRole: AccessControlRoleType, id?: number) => {
  const context = useListItemContext<Pick<IAccessControl, "address" | "account">, Array<IAccessControl>>();

  const hasPermission = useMemo(() => {
    if (!id || !context) {
      return false;
    }
    if (!context.callbackResponse[id]) {
      return false;
    }
    return context.callbackResponse[id].some(item => item.role === permissionRole);
  }, [context, permissionRole]);

  return {
    hasPermission,
  };
};
