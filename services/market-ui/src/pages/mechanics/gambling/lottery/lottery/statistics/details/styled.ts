import { Box, Button, Collapse, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

export const Root = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
}));

export const StyledCollapse = styled(Collapse)(({ theme }) => ({
  width: "100%",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledMatches = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%",
}));

export const StyledTotalInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRight: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  height: "100%",
}));

export const StyledMatch = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const StyledTotalTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  textAlign: "center",
  marginTop: theme.spacing(1),
}));

export const StyledMatchTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  textAlign: "center",
  fontWeight: 400,
  padding: theme.spacing(2),
}));

export const StyledMatchSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  textAlign: "center",
  fontSize: 16,
  fontWeight: 400,
}));

export const StyledMatchPrize = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  textAlign: "center",
  fontSize: "1.25rem",
  fontWeight: 500,
}));

export const StyledMatchWinners = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  textAlign: "center",
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  textTransform: "none",
}));

export interface IExpandMoreProps {
  expanded?: boolean;
}

export const ExpandMore = styled(ExpandMoreIcon, { shouldForwardProp: prop => prop !== "expanded" })<IExpandMoreProps>(
  ({ theme, expanded }) => ({
    transform: !expanded ? "rotate(0deg)" : "rotate(180deg)",
    margin: 0,
    transition: theme.transitions.create("transform", {
      duration: 300,
    }),
  }),
);
