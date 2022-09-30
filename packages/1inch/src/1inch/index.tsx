import { FC, memo } from "react";
import { Box } from "@mui/material";

import { OneInchProvider } from "./provider";

import { Swap } from "./components/swap";
import { Warning } from "./components/warning";

export const OneInch: FC = memo(() => {
  return (
    <OneInchProvider>
      <Box>
        <Warning />
        <Swap />
      </Box>
    </OneInchProvider>
  );
});
