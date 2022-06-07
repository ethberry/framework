import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";
import { IErc1155Token } from "@framework/types";

import { MultiCarousel } from "./multi-carousel";
import { useStyles } from "./styles";

export const NewErc1155: FC = () => {
  const classes = useStyles();

  const [templates, setTemplates] = useState<Array<IErc1155Token>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/erc1155-tokens/new",
      });
    },
    { success: false },
  );

  const fetchTokens = async (): Promise<any> => {
    return fn().then((json: IPaginationResult<IErc1155Token>) => {
      setTemplates(json.rows);
    });
  };

  useEffect(() => {
    void fetchTokens();
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="pages.landing.erc1155-new" />
      </Typography>
      <MultiCarousel token={templates} />
    </ProgressOverlay>
  );
};
