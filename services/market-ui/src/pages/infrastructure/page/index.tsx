import { FC, Fragment, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Navigate, useParams } from "react-router";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
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
  const [notFound, setNotFound] = useState<boolean>(false);
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
          setNotFound(true);
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

  if (notFound) {
    return <Navigate to="/message/page-not-found" />;
  }

  return (
    <ProgressOverlay isLoading={isLoading}>
      {page?.description ? (
        <Fragment>
          <PageHeader message="pages.page.title" data={page} />
          <div className={classes.content}>
            <RichTextDisplay data={page.description} />
          </div>
        </Fragment>
      ) : null}
    </ProgressOverlay>
  );
};
