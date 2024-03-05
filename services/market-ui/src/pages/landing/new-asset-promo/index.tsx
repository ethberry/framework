import { FC, useEffect, useState } from "react";

import type { IAssetPromo, IUser } from "@framework/types";
import type { IPaginationResult } from "@gemunion/types-collection";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { useApiCall } from "@gemunion/react-hooks";

import { MultiCarouselAssetPromo } from "../multi-carousel-asset-promo";

export const NewAssetPromo: FC = () => {
  const user = useUser<IUser>();
  const [promos, setPromos] = useState<Array<IAssetPromo>>([]);

  const { fn, isLoading } = useApiCall(
    async (api, data: { chainId: number }) => {
      return api.fetchJson({
        url: "/promos/new",
        data,
      });
    },
    { success: false, error: false },
  );

  const fetchTokens = async (data: { chainId: number }): Promise<void> => {
    return fn(void 0, data)
      .then((json: IPaginationResult<IAssetPromo>) => {
        setPromos(json.rows);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    void fetchTokens({ chainId: user.profile?.chainId });
  }, [user.profile?.chainId]);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <MultiCarouselAssetPromo promo={promos} />
    </ProgressOverlay>
  );
};
