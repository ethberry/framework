import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
