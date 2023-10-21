import { styled } from "@mui/material/styles";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { common, grey, indigo } from "@mui/material/colors";

export const Root = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(7),
}));

export const StyledPaper = styled(Paper)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%",
  minHeight: 200,
  margin: "1em auto",
  backgroundColor: grey[100],
  boxShadow: "none",
  borderRadius: 10,
});

export const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  padding: theme.spacing(2),
  width: "100%",
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(1),
  padding: theme.spacing(3, 4.5),
  width: theme.spacing(3),
  height: theme.spacing(9),
  backgroundColor: indigo[500],
  color: common.white,
  "&:hover": {
    backgroundColor: indigo[500],
    color: common.white,
  },
})) as typeof IconButton;

export const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  textAlign: "center",
}));

export const StyledRoundWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledRoundDescription = styled(Box)({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
});

export const StyledRound = styled(Box)(({ theme }) => ({
  ...theme.typography.h6,
}));

export const StyledDrawn = styled(Box)(({ theme }) => ({
  ...theme.typography.caption,
}));

export const StyledRoundPagination = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(1),
  justifySelf: "flex-end",
  marginLeft: "auto",
}));

export const StyledControlIcon = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

export const StyledSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  textAlign: "center",
  marginTop: theme.spacing(1),
}));
