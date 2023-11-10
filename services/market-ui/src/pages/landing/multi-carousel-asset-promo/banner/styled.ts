import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export const StyledImage = styled(Box)(({ theme }) => ({
  margin: "0 auto",
  display: "block",
  height: "100%",
  maxWidth: "100%",
  minWidth: 260,
  minHeight: 260,
  maxHeight: 330,
  objectFit: "contain",
  [theme.breakpoints.down("sm")]: {
    minWidth: 200,
    minHeight: 200,
    maxHeight: 260,
  },
})) as typeof Box;

export const StyledContent = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(6),
  [theme.breakpoints.down("sm")]: {
    paddingRight: 0,
  },
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
  [theme.breakpoints.down("sm")]: {
    ...theme.typography.h4,
  },
}));

export const StyledDescription = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

export const StyledTime = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0, 4),
  color: "red",
  height: "1em",
  textAlign: "center",
}));

export const StyledButtonWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(4, 0, 3),
  textAlign: "center",
}));
