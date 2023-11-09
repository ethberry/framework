import { Alert } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledAlert = styled(Alert)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));
