import { CardMedia, CardMediaProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface IStyledCardMediaProps extends CardMediaProps {
  height?: number;
}

export const StyledCardMedia = styled(CardMedia, {
  shouldForwardProp: prop => prop !== "height",
})<IStyledCardMediaProps>(({ height = 200 }) => ({
  height,
}));
