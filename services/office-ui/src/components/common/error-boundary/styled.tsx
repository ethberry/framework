import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { NodeEnv } from "@framework/types";

export const StyledError = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  overflowY: "auto",
  minHeight: `calc(100vh - ${theme.spacing(16)})`,
  width: "100%",
  marginTop: process.env.NODE_ENV !== NodeEnv.production ? theme.spacing(4) : 0,
}));
