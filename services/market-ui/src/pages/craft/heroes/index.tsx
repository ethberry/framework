import { FC } from "react";
import { Grid } from "@mui/material";

import { CraftTabs, ITabPanelProps } from "../tabs";

export const Heroes: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== CraftTabs.heroes) {
    return null;
  }

  return <Grid>Heroes</Grid>;
};
