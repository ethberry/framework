import { FC, Fragment, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useParams } from "react-router";

import { PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ApiError, useApi } from "@gemunion/provider-api-firebase";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { IPage } from "@framework/types";

import { useStyles } from "./styles";

export const Page: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<IPage>({} as IPage);

  const api = useApi();

  const fetchPage = async (): Promise<void> => {
    setIsLoading(true);

    return api
      .fetchJson({
        url: `/pages/${slug as string}`,
      })
      .then((json: IPage) => {
        setPage(json);
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
    void fetchPage();
  }, [slug]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <PageHeader message="pages.page.title" data={page} />
      <div className={classes.content}>
        <RichTextDisplay data={page.description} />
      </div>
    </Fragment>
  );
};
