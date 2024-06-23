import { useApiCall } from "@gemunion/react-hooks";
import { AccessControlRoleType } from "@framework/types";

export interface IAccessControl {
  address: string;
  account: string;
  role: AccessControlRoleType;
}

export const useCheckPermissions = () => {
  return useApiCall(
    (api, values: IAccessControl) =>
      api.fetchJson({
        url: "/access-control/check",
        data: values,
      }),
    { success: false, error: false },
  );
};
