import { Box, CSSObject } from "@mui/material";
import { Theme, styled } from "@mui/material/styles";

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

export interface IStyledImageListProps {
  count?: number;
}

export const StyledImageList = styled(Box, { shouldForwardProp: prop => prop !== "count" })<IStyledImageListProps>(
  ({ count = 2, theme }) => ({
    position: "relative",
    height: "100%",
    width: "100%",
    ...generateFanStyles(count, count <= 3 ? 30 : count <= 6 ? 20 : 25, theme),
    "&:hover": {
      ...generateFanStyles(count, count <= 3 ? 35 : count <= 6 ? 25 : 30, theme),
    },
    [theme.breakpoints.down("md")]: {
      minHeight: 300,
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
}));

export const StyledDescription = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));
