import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(4, 0, 1),
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: theme.spacing(1),
}));
