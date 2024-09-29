import { useCallback } from "react";
import { useApiCall } from "@ethberry/react-hooks";
import { IAccessControl } from "@framework/types";

export const useCheckPermissions = () => {
  const { fn } = useApiCall(
    (api, values: Pick<IAccessControl, "address" | "account">) =>
      api.fetchJson({
        url: "/access-control",
        data: values,
      }),
    { success: false, error: false },
  );

  const checkPermissions = useCallback(async (value: IAccessControl) => {
    const { address, account } = value;
    return fn(void 0, { account, address }) as Promise<IAccessControl>;
  }, []);

  return { checkPermissions };
};
