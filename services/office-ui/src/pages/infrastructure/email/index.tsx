import { FC, MouseEvent } from "react";
import { Grid, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Mail } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useApiCall } from "@ethberry/react-hooks";
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
          {Object.values(EmailType).map(email => (
            <ListItemButton key={email} onClick={sendEmail(email)}>
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText>
                <FormattedMessage id={`enums.emailType.${email}`} />
              </ListItemText>
            </ListItemButton>
          ))}
        </List>
      </ProgressOverlay>
    </Grid>
  );
};
