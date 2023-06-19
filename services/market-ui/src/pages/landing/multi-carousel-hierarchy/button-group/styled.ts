import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  position: "absolute",
  top: "50%",
  width: "calc(100% - 16px)",
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    width: "calc(100% + 100px)",
    marginLeft: theme.spacing(-7),
    marginRight: theme.spacing(-7),
  },
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    color: theme.palette.common.white,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  },
}));
