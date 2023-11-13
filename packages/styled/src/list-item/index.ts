import { ListItem, ListItemProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface IStyledListItemProps extends ListItemProps {
  wrap?: boolean;
}

export const StyledListItem = styled(ListItem, {
  shouldForwardProp: prop => prop !== "wrap",
})<IStyledListItemProps>(({ wrap, theme }) => ({
  flexWrap: wrap ? "wrap" : "nowrap",
  padding: theme.spacing(1, 0),
}));
