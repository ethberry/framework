import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 2,
}));

export const StyledAssetWrapper = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
});
