import { Box, BoxProps, CSSObject, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";

const generateFanStyles = (count: number, angle: number, theme: Theme): CSSObject => {
  const offset = angle / 2;
  const increment = angle / (count + 1);
  const styles: CSSObject = {};

  for (let i = 1; i <= count; i++) {
    styles[`& > div:nth-of-type(${i})`] = {
      transform: `translate(-50%, -50%) rotate(${-offset + increment * i}deg)`,
      transformOrigin: `center ${count <= 3 ? 400 : count <= 6 ? 700 : 270}%`,
      [theme.breakpoints.down("md")]: {
        transformOrigin: "center 50%",
      },
    };
  }

  return styles;
};

export interface IStyledImageListProps extends BoxProps {
  count?: number;
}

export const StyledImageList = styled(Box, { shouldForwardProp: prop => prop !== "count" })<IStyledImageListProps>(
  ({ count = 2, theme }) => ({
    position: "relative",
    height: "100%",
    minHeight: 300,
    width: "100%",
    ...generateFanStyles(count, count <= 3 ? 30 : count <= 6 ? 20 : 25, theme),
    "&:hover": {
      ...generateFanStyles(count, count <= 3 ? 35 : count <= 6 ? 25 : 30, theme),
    },
    [theme.breakpoints.down("md")]: {
      "&:hover": {
        ...generateFanStyles(count, 60, theme),
      },
    },
  }),
);

export const StyledImageListItem = styled(Box)(({ theme }) => ({
  background: theme.palette.common.white,
  height: "220px",
  width: "150px",
  borderRadius: "5px",
  transition: "transform 1s ease-out",
  boxShadow: theme.shadows[1],
  left: "50%",
  top: "50%",
  position: "absolute",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
})) as typeof Box;

export const StyledImage = styled(Box)(({ theme }) => ({
  display: "block",
  margin: theme.spacing(0, "auto"),
  maxWidth: "70%",
})) as typeof Box;

export const StyledDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  margin: theme.spacing(1, 0),
})) as typeof Typography;
