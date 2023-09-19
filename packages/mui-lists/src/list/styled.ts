import { List, ListProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import { IStyledListProps } from "./index";

export const StyledMuiList = styled(List, { shouldForwardProp: prop => prop !== "withScroll" })<
  ListProps & IStyledListProps
>(({ theme, withScroll }) => ({
  overflowX: withScroll ? "scroll" : "inherit",
  [theme.breakpoints.down("xs")]: {},
})) as typeof List;
