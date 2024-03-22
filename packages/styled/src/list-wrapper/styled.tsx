import { Box, List, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  minHeight: 100,
  height: "100%",
  width: "100%",
});

export const StyledList = styled(List)({
  overflowX: "auto",
});

export const StyledEmptyMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 400,
  fontSize: 16,
}));
