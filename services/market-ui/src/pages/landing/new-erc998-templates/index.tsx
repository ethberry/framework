import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";
import { IUniTemplate } from "@framework/types";

import { MultiCarousel } from "./multi-carousel";
import { useStyles } from "./styles";

export const NewErc998: FC = () => {
  const classes = useStyles();

  const [templates, setTemplates] = useState<Array<IUniTemplate>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/erc998-templates/new",
      });
    },
    { success: false, error: false },
  );

  const fetchTokens = async (): Promise<void> => {
    return fn()
      .then((json: IPaginationResult<IUniTemplate>) => {
        setTemplates(json.rows);
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
        <FormattedMessage id="pages.landing.erc998-new" />
      </Typography>
      <MultiCarousel template={templates} />
    </ProgressOverlay>
  );
};
