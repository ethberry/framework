import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

export const StyledImage = styled(Box)({
  maxWidth: "100%",
}) as typeof Box;
