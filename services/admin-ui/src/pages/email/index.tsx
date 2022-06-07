import { FC, MouseEvent } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, List, ListItem, ListItemText } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { EmailType } from "@framework/types";

export const Email: FC = () => {
  const { fn, isLoading } = useApiCall(async (api, email: string) => {
    await api.fetchJson({
      url: `/emails/${email}`,
      method: "POST",
    });
  });

  const sendEmail =
    (email: EmailType) =>
    (e: MouseEvent): Promise<void> => {
      e.preventDefault();
      return fn(null as unknown as any, email);
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
