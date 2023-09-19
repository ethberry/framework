import { FC, Fragment, MouseEvent } from "react";
import { FormattedMessage } from "react-intl";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
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
    <Fragment>
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
    </Fragment>
  );
};
