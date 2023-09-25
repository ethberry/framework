import { Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledToolbar = styled(Toolbar)({
  minHeight: "1em !important",
});

export const StyledTitle = styled(Typography)({
  flexGrow: 1,
}) as typeof Typography;
