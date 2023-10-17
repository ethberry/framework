import { Typography } from "@mui/material";
import { CSSObject, styled } from "@mui/material/styles";
import { DataGridPremium, gridClasses } from "@mui/x-data-grid-premium";

export const wrapperMixin: CSSObject = {
  width: "100%",
};

export const StyledTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(1),
}));

export const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => ({
  [`& .${gridClasses.cell}`]: {
    padding: theme.spacing(1.5),
  },
  [`& .${gridClasses["row--detailPanelExpanded"]} .${gridClasses.cell}`]: {
    borderBottom: "none",
  },
}));
