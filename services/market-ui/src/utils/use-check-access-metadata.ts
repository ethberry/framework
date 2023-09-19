import { useApiCall } from "@gemunion/react-hooks";
import { AccessControlRoleType } from "@framework/types";

export interface IAccessControl {
  address: string;
  account: string;
}

export const useCheckAccessMetadata = () => {
  const { fn: checkAccessMetadata, isLoading } = useApiCall(
    (api, values: IAccessControl) =>
      api.fetchJson({
        url: "/access-control/check",
        data: {
          ...values,
          role: AccessControlRoleType.METADATA_ROLE,
        },
      }),
    { success: false, error: false },
  );

  return {
    checkAccessMetadata,
    isLoading,
  };
};
