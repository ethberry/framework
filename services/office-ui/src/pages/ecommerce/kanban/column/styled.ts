import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledContainer = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 165,
  backgroundColor: theme.palette.grey[100],
  [theme.breakpoints.down("sm")]: {
    "min-width": "calc(100% - 16px)",
  },
}));

export const StyledHeader = styled(Typography)(({ theme }) => ({
  padding: 0,
  lineHeight: "28px",
  textTransform: "uppercase",
  fontWeight: 600,
  textAlign: "center",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
})) as typeof Typography;
