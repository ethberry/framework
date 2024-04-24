import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)({
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const StyledWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));
