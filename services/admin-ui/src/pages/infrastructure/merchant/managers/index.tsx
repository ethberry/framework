import { FC } from "react";
import { Typography } from "@mui/material";

import { ITabPanelProps } from "../tabs";

export const MerchantManagers: FC<ITabPanelProps> = props => {
  const { open } = props;

  if (!open) {
    return null;
  }

  return <Typography>Not implemented...</Typography>;
};
