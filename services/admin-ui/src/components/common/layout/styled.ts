import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)({
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  minHeight: "100vh",
  position: "relative",
});

export const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));
