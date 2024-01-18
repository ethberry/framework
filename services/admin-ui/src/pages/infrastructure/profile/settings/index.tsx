import { FC } from "react";
import { Grid } from "@mui/material";

import type { ITabPanelProps } from "../tabs";
import { Wallet } from "./wallet";

export const ProfileSettings: FC<ITabPanelProps> = props => {
  const { open } = props;

  if (!open) {
    return null;
  }

  return (
    <Grid>
      <Wallet />
    </Grid>
  );
};
