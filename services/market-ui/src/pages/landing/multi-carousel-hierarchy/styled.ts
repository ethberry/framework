import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const Root = styled(Box)(({ theme }) => ({
  "& .MultiCarouselHierarchy-Container": {
    height: 480,
    margin: theme.spacing(0, -1, 0, -1),
  },
  "& .MultiCarouselHierarchy-Item": {
    padding: theme.spacing(2, 1, 2, 1),
    perspective: 2000,
    backfaceVisibility: "hidden",
  },
}));
