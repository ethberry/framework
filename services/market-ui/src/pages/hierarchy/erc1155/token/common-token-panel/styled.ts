import { Box, Card, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledList = styled(Box)({
  paddingLeft: 0,
  margin: 0,
  listStylePosition: "inside",
}) as typeof Box;

export const StyledToolbar = styled(Toolbar)({
  minHeight: "1em !important",
});

export const StyledTitle = styled(Typography)({
  flexGrow: 1,
}) as typeof Typography;
