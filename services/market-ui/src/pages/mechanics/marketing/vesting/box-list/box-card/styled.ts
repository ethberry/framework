import { Card, CardContent, CardMedia, CardMediaProps, styled } from "@mui/material";

export interface IStyledCardMediaProps extends CardMediaProps {
  height?: number;
}

export const Root = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "rgb(255, 255, 255)",
  boxShadow:
    "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
  borderRadius: theme.spacing(0.5),

  "& .MuiCardActionArea-root": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 0, 1.5, 1.5),

    "& .MuiCardHeader-root": {
      padding: 0,
    },
  },

  "& .MuiCardActions-root": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1.5, 1, 1.5, 1.5),

    "& .MuiCardContent-root": {
      padding: 0,
    },

    "& .MuiGrid-item": {
      display: "flex",
      justifyContent: "flex-end",
    },
  },

  "& .MuiCardHeader-title": {
    fontSize: theme.spacing(3),
    fontWeight: 600,
    lineHeight: "140%",
    letterSpacing: "-0.12px",
    color: theme.palette.text.secondary,
  },

  "& .MuiButton-outlinedPrimary": {
    color: "rgb(25, 118, 210)",
    border: "1px solid rgb(25, 118, 210)",

    "&:hover": {
      textDecoration: "none",
      backgroundColor: "rgba(25, 118, 210, 0.04)",
    },
  },

  "& span": {
    textAlign: "center",
    fontSize: theme.spacing(1.5),
    fontWeight: 400,
    lineHeight: "140%",
    letterSpacing: "-0.12px",
    color: theme.palette.text.secondary,
  },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: theme.spacing(1),
}));

export const StyledCardMedia = styled(CardMedia, {
  shouldForwardProp: prop => prop !== "height",
})<IStyledCardMediaProps>(({ height = 60 }) => ({
  height,
  width: 60,
  borderRadius: "50%",
  borderColor: "#fff",
  borderStyle: "solid",
  borderWidth: 0,
  overflow: "hidden",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  objectFit: "cover",
}));
