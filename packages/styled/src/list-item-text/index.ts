import { ListItemText, ListItemTextProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface IStyledListItemTextProps extends ListItemTextProps {
  long?: boolean;
}

export const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: prop => prop !== "long",
})<IStyledListItemTextProps>(({ long, theme }) => ({
  flex: long ? 2 : 1,
  paddingRight: theme.spacing(1),
  wordWrap: "break-word",
}));
