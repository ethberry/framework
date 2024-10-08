import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(2),
  },
})) as typeof Paper;

export const StyledImage = styled(Box)(({ theme }) => ({
  display: "block",
  margin: theme.spacing(0, "auto"),
  maxWidth: "70%",
})) as typeof Box;

export const StyledDescription = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  margin: theme.spacing(1, 0),
})) as typeof Box;
