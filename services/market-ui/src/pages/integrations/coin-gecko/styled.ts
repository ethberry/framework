import { Paper, Select, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
})) as typeof Paper;

export const StyledSelect = styled(Select)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
})) as typeof Typography;
