import { FC, MouseEvent } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Mail } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { EmailType } from "@framework/types";

export const Email: FC = () => {
  const { fn, isLoading } = useApiCall(async (api, email: string) => {
    return api.fetchJson({
      url: `/emails/${email}`,
      method: "POST",
    });
  });

  const sendEmail =
    (email: EmailType) =>
    (e: MouseEvent): void => {
      e.preventDefault();
      void fn(null as unknown as any, email);
    };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "emails"]} />

      <PageHeader message="pages.emails.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {Object.values(EmailType).map((email, i) => (
            <ListItem button key={i} onClick={sendEmail(email)}>
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
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
