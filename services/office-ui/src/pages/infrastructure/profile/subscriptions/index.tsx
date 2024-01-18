import { FC } from "react";
import { Typography } from "@mui/material";

import type { ITabPanelProps } from "../tabs";

export const ProfileSubscriptions: FC<ITabPanelProps> = props => {
  const { open } = props;

  if (!open) {
    return null;
  }

  return <Typography>You are not subscribed...</Typography>;
};
