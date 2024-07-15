import { useCallback } from "react";
import { useApiCall } from "@gemunion/react-hooks";
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
        // url: "/access-control/check",
        url: "/access-control",
        data: values,
      }),
    { success: false, error: false },
  );

  const checkPermissions = useCallback(async (value: IAccessControl) => {
    const { account, address } = value;
    return fn(void 0, { account, address });
  }, []);

  return { checkPermissions };
};
