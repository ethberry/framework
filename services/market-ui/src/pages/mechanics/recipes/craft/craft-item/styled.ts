import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(2),
  },
}));
