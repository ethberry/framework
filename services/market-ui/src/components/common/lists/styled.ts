import { ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  flexWrap: "wrap",
  [theme.breakpoints.down("xs")]: {},
}));

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.down("xs")]: {},
}));

export const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)(({ theme }) => ({
  minWidth: theme.spacing(9),
}));
