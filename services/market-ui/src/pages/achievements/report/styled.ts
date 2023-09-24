import { Box, Grid, Table, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPopoverWrapper = styled(Box)({
  zIndex: 1000,
});

export const StyledTable = styled(Table)({
  minWidth: 650,
});

export const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  margin: theme.spacing(2, 0),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));
