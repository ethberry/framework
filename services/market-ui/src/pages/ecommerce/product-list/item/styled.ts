import { Box, CardMedia } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledDescription = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  overflow: "hidden",
  height: 80,
}));

export const StyledCardMedia = styled(CardMedia)({
  height: 200,
});
