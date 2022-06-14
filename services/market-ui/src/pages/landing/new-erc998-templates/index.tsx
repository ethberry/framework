import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";
import { IErc998Template } from "@framework/types";

import { MultiCarousel } from "./multi-carousel";
import { useStyles } from "./styles";

export const NewErc998: FC = () => {
  const classes = useStyles();

  const [templates, setTemplates] = useState<Array<IErc998Template>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/erc998-templates/new",
      });
    },
    { success: false },
  );

  const fetchTokens = async (): Promise<void> => {
    return fn().then((json: IPaginationResult<IErc998Template>) => {
      setTemplates(json.rows);
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
