import { FC } from "react";
import { Grid } from "@mui/material";

import { ITabPanelProps, ProfileTabs } from "../tabs";
import { SeaportIncrementNonceButton } from "../../../components/buttons/seaport/increment-nonce";

export const ProfileSeaport: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== ProfileTabs.seaport) {
    return null;
  }

  return (
    <Grid>
      <SeaportIncrementNonceButton />
    </Grid>
  );
};
