import { Grid, styled } from "@mui/material";

export const Root = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
})) as typeof Grid;

export const GridContainer = styled(Grid)(() => ({
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
})) as typeof Grid;

export const GridItem = styled(Grid)(() => ({})) as typeof Grid;
