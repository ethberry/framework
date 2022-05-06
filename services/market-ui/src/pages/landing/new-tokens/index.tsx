import { FC, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Typography } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { ApiError, useApi } from "@gemunion/provider-api";
import { IErc1155Token } from "@framework/types";
import { IPaginationResult } from "@gemunion/types-collection";

import { MultiCarousel } from "./multi-carousel";
import { useStyles } from "./styles";

export const NewErc1155: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<Array<IErc1155Token>>([]);

  const api = useApi();

  const fetchTokens = async (): Promise<void> => {
    setIsLoading(true);
    return api
      .fetchJson({
        url: "/erc1155-tokens/new",
      })
      .then((json: IPaginationResult<IErc1155Token>) => {
        setTemplates(json.rows);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      })
      .finally(() => {
        setIsLoading(false);
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
