import { InputAdornment, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

export const StyledInputAdornment = styled(InputAdornment)({
  marginLeft: "auto",
});
