import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledImage = styled(Box)(({ theme }) => ({
  display: "block",
  margin: theme.spacing(0, "auto"),
  maxWidth: "70%",
})) as typeof Box;

export const StyledDescription = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  margin: theme.spacing(1, 0),
}));
