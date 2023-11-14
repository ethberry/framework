import { Grid, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGridPremium, gridClasses } from "@mui/x-data-grid-premium";

export const wrapperSxMixin = {
  mb: 2,
};

export const StyledGrid = styled(Grid)(({ theme }) => ({
  margin: theme.spacing(0, -2),
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

export const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => ({
  [`& .${gridClasses.cell}`]: {
    padding: theme.spacing(1.5),
  },
  [`& .${gridClasses["row--detailPanelExpanded"]} .${gridClasses.cell}`]: {
    borderBottom: "none",
  },
}));
