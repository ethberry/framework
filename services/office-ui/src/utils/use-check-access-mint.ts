import { useApiCall } from "@gemunion/react-hooks";
import { AccessControlRoleType } from "@framework/types";

export interface IAccessControl {
  address: string;
  account: string;
}

export const useCheckAccessMint = () => {
  const { fn: checkAccessMint, isLoading } = useApiCall(
    (api, values: IAccessControl) =>
      api.fetchJson({
        url: "/access-control/check",
        data: {
          ...values,
          role: AccessControlRoleType.MINTER_ROLE,
        },
      }),
    { success: false, error: false },
  );

  return {
    checkAccessMint,
    isLoading,
  };
};
