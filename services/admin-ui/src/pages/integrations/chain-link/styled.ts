import { Box, Card, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGridPremium, gridClasses } from "@mui/x-data-grid-premium";

export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledToolbar = styled(Toolbar)({
  minHeight: "1em !important",
});

export const StyledTypography = styled(Typography)({
  flexGrow: 1,
}) as typeof Typography;

export const StyledList = styled(Box)({
  paddingLeft: 0,
  margin: 0,
  listStylePosition: "inside",
}) as typeof Box;

export const blue = {
  50: "#F0F7FF",
  200: "#A5D8FF",
  400: "#3399FF",
  900: "#003A75",
};

export const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

export const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => ({
  [`& .${gridClasses.cell}`]: {
    padding: theme.spacing(1.5),
  },
  [`& .${gridClasses["row--detailPanelExpanded"]} .${gridClasses.cell}`]: {
    borderBottom: "none",
  },
}));
