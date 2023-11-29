import { Box, Card, CardActions, CardContent, Grid, TableContainer, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  height: "100%",
});

export const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

export const StyledCardActions = styled(CardActions)({
  marginTop: "auto",
});

export const StyledGrid = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
});

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: "auto",
  paddingTOp: theme.spacing(2),
}));

export const StyledImage = styled(Box)({
  width: "100%",
  height: 100,
  objectFit: "contain",
}) as typeof Box;

export const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: "center",
}));

export const StyledExchangeTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  textAlign: "center",
}));
