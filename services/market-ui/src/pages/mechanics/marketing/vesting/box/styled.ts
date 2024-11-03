import { Grid, Box, styled } from "@mui/material";

export interface IStylesScheme {
  [key: string]: string | number | IStylesScheme;
}

export const pageHeader = (theme: any): IStylesScheme => ({
  fontSize: theme.spacing(4),
  fontWeight: 700,
  lineHeight: "140%",
  letterSpacing: "-0.12px",
  color: theme.palette.text.secondary,
});

export const Root = styled(Box)(({ theme }) => ({
  "& h2": {
    ...pageHeader(theme),
  },

  "& .MuiBreadcrumbs-ol > .MuiBreadcrumbs-li > p": {
    color: theme.palette.text.secondary,
    fontSize: theme.spacing(1.5),
    fontWeight: 600,
    lineHeight: "140%",
    textDecoration: "none",
  },

  "& .MuiCardContent-root": {
    "& .MuiTypography-body1": {
      color: theme.palette.text.secondary,
      fontSize: theme.spacing(2),
      fontWeight: 600,
      lineHeight: "140%",
    },
    padding: 0,
    paddingLeft: theme.spacing(2),
  },

  "& .MuiCardActions-root": {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    paddingLeft: theme.spacing(2),
  },

  "& text": {
    fill: theme.palette.text.secondary,
  },

  "& #function-plot": {
    width: "100%",
  },

  "& .MuiButton-outlinedPrimary": {
    color: "rgb(25, 118, 210)",
    border: "1px solid rgb(25, 118, 210)",

    "&:hover": {
      textDecoration: "none",
      backgroundColor: "rgba(25, 118, 210, 0.04)",
    },
  },

  "& .DraftEditor-root": {
    marginTop: theme.spacing(3),
  },
}));

export const StyledHeader = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  "& .MuiGrid-item": {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export const StyledContent = styled(Grid)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingInline: theme.spacing(1),
}));

export const StyledSpinnerBox = styled(Grid)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));
