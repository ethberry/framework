import { useCallback } from "react";
import { useApiCall } from "@ethberry/react-hooks";
import { AccessControlRoleType } from "@framework/types";

export interface IAccessControl {
  address: string;
  account: string;
  role?: AccessControlRoleType;
}

export const useCheckPermissions = () => {
  const { fn } = useApiCall(
    (api, values: IAccessControl) =>
      api.fetchJson({
        url: "/access-control/check",
        data: values,
      }),
    { success: false, error: false },
  );

  const checkPermissions = useCallback(async (value: IAccessControl) => {
    const { role = AccessControlRoleType.DEFAULT_ADMIN_ROLE } = value;
    return fn(void 0, { ...value, role });
  }, []);

  return { checkPermissions };
};
