import { ListItem } from "@mui/material";
import { styled } from "@mui/material/styles";

import { IStyledListItemProps } from "./types";

export const StyledListItem = styled(ListItem, {
  shouldForwardProp: prop => prop !== "wrap",
})<IStyledListItemProps>(({ wrap, theme }) => ({
  flexWrap: wrap ? "wrap" : "nowrap",
  padding: theme.spacing(1, 0),
}));
