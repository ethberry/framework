import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
}));

export const StyledImage = styled(Box)(({ theme }) => ({
  margin: "0 auto",
  display: "block",
  height: "100%",
  maxWidth: "100%",
  minWidth: 260,
  minHeight: 260,
  [theme.breakpoints.down("sm")]: {
    minWidth: 180,
    minHeight: 180,
  },
})) as typeof Box;

export const StyledContent = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(6),
  [theme.breakpoints.down("xs")]: {
    paddingRight: 0,
  },
}));

export const StyledDescription = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

export const StyledTime = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  color: "red",
  height: "1em",
  textAlign: "center",
}));

export const StyledButtonWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  paddingRight: theme.spacing(6),
  textAlign: "center",
  [theme.breakpoints.down("xs")]: {
    paddingRight: 0,
  },
}));
