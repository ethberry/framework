import { Alert } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));
