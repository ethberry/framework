import { styled } from "@mui/material/styles";
import { Box, IconButton, IconButtonProps, Paper, Typography } from "@mui/material";
import { blueGrey, common, grey, indigo } from "@mui/material/colors";

export const StyledWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%",
});

export const StyledPaper = styled(Paper)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  flexWrap: "wrap",
  width: "100%",
  maxWidth: "36em",
  margin: "1em auto",
  padding: "1em",
  backgroundColor: grey[100],
  boxShadow: "none",
  borderRadius: 10,
});

export interface IStyledIconButtonProps extends IconButtonProps {
  isSelected: boolean;
}

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: prop => prop !== "isSelected",
})<IStyledIconButtonProps>(({ isSelected, theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(1),
  padding: theme.spacing(3, 4.5),
  width: theme.spacing(3),
  height: theme.spacing(9),
  backgroundColor: isSelected ? indigo[500] : common.white,
  color: isSelected ? common.white : indigo[500],
  "&:hover": {
    backgroundColor: blueGrey[200],
  },
  "&:disabled": {
    backgroundColor: common.white,
    color: indigo[200],
  },
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));
