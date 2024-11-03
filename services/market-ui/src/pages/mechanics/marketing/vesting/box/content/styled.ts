import { Card, styled, CardContent } from "@mui/material";

export const Root = styled(Card)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: theme.spacing(3),
  padding: theme.spacing(0.5, 0),
  backgroundColor: "rgb(255, 255, 255)",
  boxShadow:
    "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
  borderRadius: theme.spacing(0.5),

  "& .MuiCardContent-root": {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: theme.spacing(1),
}));
