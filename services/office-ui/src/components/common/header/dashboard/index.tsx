import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useIntl } from "react-intl";

import type { IUser } from "@framework/types";
import { useUser } from "@ethberry/provider-user";

export const DashboardButton: FC = () => {
  const { formatMessage } = useIntl();
  const user = useUser<IUser>();
  const isUserAuthenticated = user.isAuthenticated();

  if (!isUserAuthenticated) {
    return null;
  }

  return (
    <Tooltip title={formatMessage({ id: "components.header.menu.dashboard" })}>
      <IconButton to="/dashboard" color="inherit" component={RouterNavLink}>
        <Dashboard />
      </IconButton>
    </Tooltip>
  );
};
