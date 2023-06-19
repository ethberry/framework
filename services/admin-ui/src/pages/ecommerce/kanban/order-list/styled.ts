import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  userSelect: "none",
  width: "100%",
  height: "100%",
  overflowY: "auto",
  padding: theme.spacing(0.75),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(0.5),
}));
