import { ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  paddingRight: theme.spacing(3),
}));
