import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { List, ListItem, ListItemText, Paper } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { EmailType } from "@gemunionstudio/framework-types";

export const Main: FC = () => {
  return (
    <Paper>
      <List component="nav">
        {Object.values(EmailType).map(key => (
          <ListItem button component={RouterLink} to={`/${EmailType[key]}`} key={key}>
            <ListItemText primary={<FormattedMessage id={`enums.emailType.${key}`} />} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
