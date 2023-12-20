import { Box, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
});

export const StyledCardWrapper = styled(Box)({
  width: 300,
  height: 300,
});

export const StyledCard = styled(Card)({
  width: 300,
  height: 300,
  borderRadius: "50%",
});

export const StyledCardContent = styled(CardContent)({
  padding: 0,
  "& img": {
    width: 300,
    height: 300,
    objectFit: "contain",
  },
});
