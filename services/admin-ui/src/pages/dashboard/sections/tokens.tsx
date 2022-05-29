import { FC } from "react";
import { Grid } from "@mui/material";

import { useUser } from "@gemunion/provider-user";
import { IUser, UserRole } from "@framework/types";
import { Erc20Sections } from "./erc20";
import { Erc1155Section } from "./erc1155";
import { Erc721Section } from "./erc721";
import { Seaport } from "./seaport";

export const Tokens: FC = () => {
  const user = useUser<IUser>();

  if (!user.profile.userRoles.includes(UserRole.ADMIN)) {
    return null;
  }

  return (
    <Grid container spacing={2} sx={{ pb: 1 }}>
      <Grid item xs={6}>
        <Erc20Sections />
      </Grid>
      <Grid item xs={6}>
        <Erc1155Section />
      </Grid>
      <Grid item xs={6}>
        <Erc721Section />
      </Grid>
      <Grid item xs={6}>
        <Seaport />
      </Grid>
    </Grid>
  );
};
