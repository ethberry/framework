import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));
