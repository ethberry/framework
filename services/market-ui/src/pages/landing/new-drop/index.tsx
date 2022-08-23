import { FC, useEffect, useState } from "react";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";
import { IDrop } from "@framework/types";

import { MultiCarouselDrop } from "../multi-carousel-drop";

export const NewDrop: FC = () => {
  const [drops, setDrops] = useState<Array<IDrop>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/drops/new",
      });
    },
    { success: false, error: false },
  );

  const fetchTokens = async (): Promise<void> => {
    return fn()
      .then((json: IPaginationResult<IDrop>) => {
        setDrops(json.rows);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    void fetchTokens();
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <MultiCarouselDrop drops={drops} />
    </ProgressOverlay>
  );
};
