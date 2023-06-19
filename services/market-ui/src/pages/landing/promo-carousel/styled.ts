import { Box } from "@mui/material";
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

export const StyledImage = styled(Box)({
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  backgroundPosition: "center",
  cursor: "pointer",
  overflow: "hidden",
  display: "block",
  height: 750,
  width: "100%",
});
