import { FC, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import type { IAssetPromo } from "@framework/types";
import type { IPaginationResult } from "@gemunion/types-collection";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";

import { MultiCarouselAssetPromo } from "../multi-carousel-asset-promo";

export const NewAssetPromo: FC = () => {
  const { chainId } = useWeb3React();
  const [promos, setPromos] = useState<Array<IAssetPromo>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/promos/new",
      });
    },
    { success: false, error: false },
  );

  const fetchTokens = async (): Promise<void> => {
    return fn()
      .then((json: IPaginationResult<IAssetPromo>) => {
        setPromos(json.rows);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    void fetchTokens();
  }, [chainId]);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <MultiCarouselAssetPromo promo={promos} />
    </ProgressOverlay>
  );
};
