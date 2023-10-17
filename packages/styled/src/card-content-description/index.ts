import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCardContentDescription = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  overflow: "hidden",
  height: 80,
}));
