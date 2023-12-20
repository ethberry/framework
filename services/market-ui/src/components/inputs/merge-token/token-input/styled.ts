import { Box, CardActions, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCardActions = styled(CardActions)({
  display: "block",
  width: "100%",
});

export const StyledCardContent = styled(CardContent)({
  margin: "auto",
  maxWidth: 220,
});

export const StyledImage = styled(Box)({
  width: "100%",
}) as typeof Box;
