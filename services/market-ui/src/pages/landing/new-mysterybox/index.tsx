import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import type { IPaginationResult } from "@gemunion/types-collection";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IMysterybox } from "@framework/types";

import { MultiCarouselMysterybox } from "../multi-carousel-mysterybox";
import { MysteryboxListItem } from "../../mechanics/mystery/box-list/item";

export const NewMysterybox: FC = () => {
  const [mysteryboxes, setMysteryboxes] = useState<Array<IMysterybox>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/mystery/boxes/new",
      });
    },
    { success: false, error: false },
  );

  const fetchTokens = async (): Promise<any> => {
    return fn()
      .then((json: IPaginationResult<IMysterybox>) => {
        setMysteryboxes(json.rows);
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
      <Typography variant="h4" sx={{ mt: 7 }}>
        <FormattedMessage id="pages.landing.mysterybox-new" />
      </Typography>
      {mysteryboxes.length ? (
        <MultiCarouselMysterybox mysteryboxes={mysteryboxes} component={MysteryboxListItem} />
      ) : null}
    </ProgressOverlay>
  );
};
