import { Box, Button, Card, CardContent, Grid, SvgIcon, Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  overflowY: "auto",
  marginTop: theme.spacing(5),
  paddingBottom: theme.spacing(2),
}));

export const StyledCardWrapper = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  height: "auto",
});

export const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(2),
  width: 300,
  display: "flex",
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

export const StyledCardContent = styled(CardContent)({
  textAlign: "center",
  display: "flex",
  flex: 1,
  height: "auto",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

export const TitleTypography = styled(Typography)(({ theme }) => ({
  color: "#222529",
  marginBottom: theme.spacing(1),
  fontFamily: "'Roboto', sans-serif",
  [theme.breakpoints.down("sm")]: {
    fontSize: 21,
    marginBottom: theme.spacing(2),
  },
}));

export const StyledDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  fontWeight: 500,
  margin: theme.spacing(-4, 0, 5),
  [theme.breakpoints.down("md")]: {
    margin: theme.spacing(0, 0, 5),
    fontSize: 18,
    fontWeight: 500,
    textAlign: "center",
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

export const FeaturesWrapper = styled(Box)({
  maxWidth: "fit-content",
  margin: "0 auto",
  textAlign: "left",
});

export const FeatureWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  display: "flex",
  alignItems: "center",
}));

export const FeatureIconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
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

export const SubscribeButton = styled(Button)(({ theme }) => ({
  marginTop: "auto",
  marginBottom: theme.spacing(1),
  fontFamily: "'Roboto', sans-serif",
  color: "#3479F6",
  backgroundColor: "#fff",
  border: "1px solid #3479F6",
  borderRadius: "32px",
  boxShadow: "none",
  "&:hover": {
    color: "#FFF",
    backgroundColor: "#3479F6",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(2),
  },
})) as typeof Button;
