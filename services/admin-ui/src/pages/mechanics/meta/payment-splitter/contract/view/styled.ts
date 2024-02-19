import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTableRow = styled(TableRow)({
  "&:last-of-type": {
    "& .MuiTableCell-root": {
      borderBottom: 0,
    },
  },
});

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
}));

export const StyledTableCellDensed = styled(TableCell)({
  padding: 0,
});
