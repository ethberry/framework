import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(2),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));
