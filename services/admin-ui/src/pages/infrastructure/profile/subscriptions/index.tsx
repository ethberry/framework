import { FC } from "react";
import { Typography } from "@mui/material";
import { ITabPanelProps, ProfileTabs } from "../tabs";

export const ProfileSubscriptions: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== ProfileTabs.subscriptions) {
    return null;
  }

  return <Typography>You are not subscribed...</Typography>;
};
