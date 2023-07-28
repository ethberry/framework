import { Box, Grid, Card, CardContent, SvgIcon, Typography, TypographyProps, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCardWrapper = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: "auto",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(2),
  display: "flex",
  height: "100%",
  flex: 1,
  [theme.breakpoints.down("sm")]: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  flex: 1,
  height: "auto",
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    "&.MuiCardContent-root": {
      paddingBottom: theme.spacing(1),
    },
  },
}));

export const TitleTypography = styled(Typography)(({ theme }) => ({
  color: "#222529",
  marginBottom: theme.spacing(1),
  fontFamily: "'Roboto', sans-serif",
  [theme.breakpoints.down("sm")]: {
    fontSize: 21,
    marginBottom: theme.spacing(2),
  },
}));

export const PriceWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const PriceTypography = styled(Typography)(({ theme }) => ({
  color: "#222529",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 500,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    marginBottom: 0,
    fontSize: 31,
  },
}));

export const MonthTypography = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: "#6E757C",
  fontFamily: "'Roboto', sans-serif",
  [theme.breakpoints.down("sm")]: {
    fontSize: 16,
  },
}));

export const Divider = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1, "auto", 6),
  height: 4,
  width: 100,
  background: "#3479F6",
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(1, "auto", 3),
  },
}));

export const FeaturesWrapper = styled(Box)(({ theme }) => ({
  maxWidth: "fit-content",
  textAlign: "left",
  [theme.breakpoints.up("md")]: {
    margin: "0 auto",
  },
}));

export const FeatureWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 1),
  display: "flex",
  alignItems: "center",
}));

export const FeatureIconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    marginRight: theme.spacing(1),
  },
}));

export const FeatureIconIncluded = styled(SvgIcon)({
  color: "#3479F6",
}) as any;

export const FeatureIconExcluded = styled(SvgIcon)({
  color: "#6E757C",
}) as any;

export const FeatureTypography = styled(Typography, {
  shouldForwardProp: prop => prop !== "included",
})<TypographyProps & { included: boolean }>(({ included }) => ({
  color: "#222529",
  fontFamily: "'Roboto', sans-serif",
  textDecoration: included ? "none" : "line-through",
}));
