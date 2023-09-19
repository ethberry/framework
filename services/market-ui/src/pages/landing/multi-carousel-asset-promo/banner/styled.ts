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
