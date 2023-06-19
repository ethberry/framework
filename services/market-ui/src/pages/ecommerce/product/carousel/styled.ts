import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)({
  flexGrow: 1,
  maxWidth: 400,
});

export const StyledImage = styled(Box)({
  maxWidth: 400,
  overflow: "hidden",
  display: "block",
  width: "100%",
}) as typeof Box;

export const StyledHeader = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: 50,
  paddingLeft: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));
