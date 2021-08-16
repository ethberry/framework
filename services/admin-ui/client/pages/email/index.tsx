import React, { FC, MouseEvent, useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, List, ListItem, ListItemText } from "@material-ui/core";

import { ProgressOverlay } from "@gemunion/material-ui-progress";
import { PageHeader } from "@gemunion/material-ui-page-header";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { EmailType } from "@gemunion/framework-types";

import { Breadcrumbs } from "../../components/common/breadcrumbs";

export const Email: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useContext(ApiContext);

  const sendEmail =
    (email: EmailType) =>
    (e: MouseEvent): Promise<void> => {
      e.preventDefault();
      setIsLoading(true);
      return api
        .fetchJson({
          url: `/emails/${email}`,
          method: "POST",
        })
        .then(() => {
          enqueueSnackbar(formatMessage({ id: "snackbar.email" }), { variant: "success" });
        })
        .catch((e: ApiError) => {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "emails"]} />

      <PageHeader message="pages.emails.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {Object.values(EmailType).map((email, i) => (
            <ListItem button key={i} onClick={sendEmail(email)} disableGutters>
              <ListItemText>
                <FormattedMessage id={`enums.emailType.${email}`} />
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>
    </Grid>
  );
};
