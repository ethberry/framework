import { useApiCall } from "@ethberry/react-hooks";

export interface ITokenOwnershipData {
  account: string;
  tokenId: number;
}

export const useCheckTokenOwnership = () => {
  const { fn: checkTokenOwnership, isLoading } = useApiCall(
    (api, data: ITokenOwnershipData) =>
      api.fetchJson({
        url: "/access-control/check/token-ownership",
        data,
      }),
    { success: false, error: false },
  );

  return {
    checkTokenOwnership,
    isLoading,
  };
};
