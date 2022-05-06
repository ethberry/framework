import { FC } from "react";
import { Grid } from "@mui/material";

import { CraftTabs, ITabPanelProps } from "../tabs";

export const Items: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== CraftTabs.items) {
    return null;
  }

  return <Grid>Items</Grid>;
};
