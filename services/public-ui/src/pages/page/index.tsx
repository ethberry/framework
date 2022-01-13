import { FC, Fragment, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useParams } from "react-router";

import { Spinner } from "@gemunion/mui-progress";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { PageHeader } from "@gemunion/mui-page-header";
import { IPage } from "@gemunion/framework-types";
import { RichTextDisplay } from "@gemunion/mui-rte";

export const Page: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<IPage>({} as IPage);

  const api = useContext(ApiContext);

  const fetchPage = async (): Promise<void> => {
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
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <PageHeader message="pages.page.title" data={page} />

      <RichTextDisplay data={page.description} />
    </Fragment>
  );
};
