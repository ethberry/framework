import { styled } from "@mui/material/styles";
import { DataGridPremium, gridClasses } from "@mui/x-data-grid-premium";

export const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => ({
  [`& .${gridClasses.cell}`]: {
    padding: theme.spacing(1.5),
  },
  [`& .${gridClasses["row--detailPanelExpanded"]} .${gridClasses.cell}`]: {
    borderBottom: "none",
  },
}));
