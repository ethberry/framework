import { Box, Link, LinkProps, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledLink = styled(Link)<LinkProps>(({ theme }) => ({
  color: theme.palette.common.white,
  textDecoration: "none",
  fontWeight: 500,
  fontSize: 36,
  "&:hover": {
    textDecoration: "none",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: 22,
  },
})) as typeof Link;

export const StyledGrow = styled(Box)({ flexGrow: 1 });

export const StyledToolbar = styled(Toolbar)({ minHeight: 64 });
