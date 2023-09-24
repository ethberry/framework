import { ListSubheader, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const StyledListSubheader = styled(ListSubheader)({
  textAlign: "right",
});
