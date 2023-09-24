import { Popover, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPopover = styled(Popover)({
  pointerEvents: "none",
});

export const StyledText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
}));
