import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Navigate, useParams } from "react-router";

import { IPage } from "@framework/types";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { ApiError } from "@gemunion/provider-api-firebase";
import { useApiCall } from "@gemunion/react-hooks";

import { StyledContentWrapper } from "./styled";

export const Page: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [notFound, setNotFound] = useState<boolean>(false);
  const [page, setPage] = useState<IPage>({} as IPage);

  const { fn: fetchPage, isLoading } = useApiCall(
    (api, slug: string) =>
      api
        .fetchJson({
          url: `/pages/${slug}`,
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
        }),
    { success: false, error: false },
  );

  useEffect(() => {
    void fetchPage(undefined, slug);
  }, [slug]);

  if (notFound) {
    return <Navigate to="/message/page-not-found" />;
  }

  return (
    <ProgressOverlay isLoading={isLoading}>
      {page?.description ? (
        <Box>
          <PageHeader message="pages.page.title" data={page} />
          <StyledContentWrapper>
            <RichTextDisplay data={page.description} />
          </StyledContentWrapper>
        </Box>
      ) : null}
    </ProgressOverlay>
  );
};
