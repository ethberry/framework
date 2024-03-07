import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface IStyledDisableOverlayProps extends BoxProps {
  isDisabled?: boolean;
}

export const StyledDisableOverlay = styled(Box, {
  shouldForwardProp: prop => prop !== "isDisabled",
})<IStyledDisableOverlayProps>(({ isDisabled }) => ({
  opacity: isDisabled ? 0.6 : 1,
  pointerEvents: isDisabled ? "none" : "auto",
})) as any;
