import { Box, Divider, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2),
}));
