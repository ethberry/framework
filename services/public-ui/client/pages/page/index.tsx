import React, {FC, Fragment, useContext, useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {useIntl} from "react-intl";
import {useParams} from "react-router";

import {Spinner} from "@gemunionstudio/material-ui-progress";
import {ApiContext, ApiError} from "@gemunionstudio/provider-api";
import {PageHeader} from "@gemunionstudio/material-ui-page-header";
import {IPage} from "@gemunionstudio/solo-types";
import {RichTextDisplay} from "@gemunionstudio/solo-material-ui-rte";

export const Page: FC = () => {
  const {slug} = useParams<{slug: string}>();
  const {enqueueSnackbar} = useSnackbar();
  const {formatMessage} = useIntl();

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<IPage>({} as IPage);

  const api = useContext(ApiContext);

  const fetchPage = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/pages/${slug}`,
      })
      .then((json: IPage) => {
        setPage(json);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({id: `snackbar.${e.message}`}), {variant: "error"});
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
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
