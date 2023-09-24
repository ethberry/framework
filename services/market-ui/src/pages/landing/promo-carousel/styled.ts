import { Box, BoxProps, MobileStepper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)(({ theme }) => ({
  flexDirection: "column",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.common.white,
  maxWidth: "1150px",
  height: 450,
}));

export interface IStyledImageProps extends BoxProps {
  imageUrl?: string;
}

export const StyledImage = styled(Box, { shouldForwardProp: prop => prop !== "imageUrl" })<IStyledImageProps>(
  ({ imageUrl }) => ({
    backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    cursor: "pointer",
    overflow: "hidden",
    display: "block",
    height: 750,
    width: "100%",
  }),
);

export const StyledMobileStepper = styled(MobileStepper)({
  width: "100%",
});
