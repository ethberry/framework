import { Box, CardMedia } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCardMedia = styled(CardMedia)({
  height: 140,
});

export const StyledDescription = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: 80,
  overflow: "hidden",
}));
