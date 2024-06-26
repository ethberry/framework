import { useApiCall } from "@gemunion/react-hooks";
import { AccessControlRoleType } from "@framework/types";
import { useCallback } from "react";

export interface IAccessControl {
  address: string;
  account: string;
}

// This is technically no more needed, as useCheckAccess check AMIN_ROLE by default
export const useCheckAccessDefaultAdmin = () => {
  const { fn: checkAccessDefaultAdmin, isLoading } = useApiCall(
    (api, values: IAccessControl) =>
      api.fetchJson({
        url: "/access-control/check",
        data: {
          ...values,
          role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
        },
      }),
    { success: false, error: false },
  );

  return {
    checkAccessDefaultAdmin,
    isLoading,
  };
};

export const useCheckAccess = (role: AccessControlRoleType = AccessControlRoleType.DEFAULT_ADMIN_ROLE) => {
  const { fn, isLoading } = useApiCall(
    (api, values: IAccessControl) =>
      api.fetchJson({
        url: "/access-control/check",
        data: {
          ...values,
          role,
        },
      }),
    { success: false, error: false },
  );

  const checkAccess = useCallback(
    async (values: IAccessControl) => {
      return fn(void 0, values);
    },
    [role],
  );

  return {
    checkAccess,
    isLoading,
  };
};
