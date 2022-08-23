import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";
import { IMysterybox } from "@framework/types";

import { useStyles } from "./styles";
import { MultiCarouselMysterybox } from "../multi-carousel-mysterybox";
import { MysteryboxListItem } from "../../mechanics/mysterybox/mysterybox-list/item";

export const NewMysterybox: FC = () => {
  const classes = useStyles();

  const [mysteryboxes, setMysteryboxes] = useState<Array<IMysterybox>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/mysterybox-boxes/new",
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
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="pages.landing.mysterybox-new" />
      </Typography>
      <MultiCarouselMysterybox mysteryboxes={mysteryboxes} component={MysteryboxListItem} />
    </ProgressOverlay>
  );
};
