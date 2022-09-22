import { FC } from "react";
import { Box, Toolbar } from "@mui/material";

import { Wallet } from "@gemunion/provider-wallet";

import { BridgeButton } from "./bridge";
import { NetworkButton } from "./network";
import { BuyCrypto } from "./buy-crypto";

export const Header: FC = () => {
  return (
    <Toolbar>
      <Box sx={{ margin: "auto" }} display="flex">
        <Wallet />
        <BridgeButton />
        <NetworkButton />
        <BuyCrypto />
      </Box>
    </Toolbar>
  );
};
